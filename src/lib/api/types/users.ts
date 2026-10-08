import { GDPS_BASE_URL, validate, type BaseClient, type ServerPaginated } from './base';

export type ServerUserMinimal = {
	id: number;
	name: string;
	account: number | null;
};

export type TopStatType = 'stars' | 'demons' | 'secret_coins' | 'creator_points';

export type TopUsersSearchParams = {
	count?: number;
	type?: TopStatType;
	max_version?: number;
};

export type RecentTopUsersSearchParams = {
	count?: number;
	type?: TopStatType;
	max_version?: number;
	daily?: boolean;
};

export type ServerUser = {
	name: string;
	id: number;
	device_id?: string;
	stars: number;
	demons: number;
	rank: number;
	creator_points: number;
	icon: number;
	color: number;
	color2: number;
	coins: number;
	icon_type: number;
	special: number;
	account_id?: number;
	created?: string;
	youtube?: string;
	cube?: number;
	ship?: number;
	ball?: number;
	ufo?: number;
	wave?: number;
	robot?: number;
	global_rank?: number;
	spider?: number;
	twitter?: string;
	twitch?: string;
	diamonds?: number;
	explosion?: number;
	permission_level?: number;
	color3?: number;
	swing?: number;
	jetpack?: number;
};

export type ServerStatGain = {
	id: string;
	stars: number;
	demons: number;
	coins: number;
	max_stars: number;
	timestamp: string;
};

export type BanType = 'leaderboard' | 'creator' | 'send' | 'comment';

export type ServerBan = {
	type: BanType;
	created: string;
	reason?: string;
};

export class UsersManager {
	constructor(private client: BaseClient) {}

	async getUser(id: number): Promise<ServerUser> {
		const data = await this.client.make_request(`${GDPS_BASE_URL}/v2/users/${id}`);

		return validate(await data.json());
	}

	async search(
		query?: string,
		page: number = 0,
		count: number = 25
	): Promise<ServerPaginated<ServerUser>> {
		const url = new URL(`${GDPS_BASE_URL}/v2/users`);

		if (query !== undefined) {
			url.searchParams.set('query', query);
		}

		url.searchParams.set('page', page.toString());
		url.searchParams.set('count', count.toString());

		const data = await this.client.make_request(url);
		return validate(await data.json());
	}

	async getTop(params: TopUsersSearchParams): Promise<ServerUser[]> {
		const url = new URL(`${GDPS_BASE_URL}/v2/users/top`);

		if (params?.count !== undefined) {
			url.searchParams.set('count', params.count.toString());
		}

		if (params?.type !== undefined) {
			url.searchParams.set('type', params.type);
		}

		if (params?.max_version !== undefined) {
			url.searchParams.set('max_version', params.max_version.toString());
		}

		const data = await this.client.make_request(url);
		return validate(await data.json());
	}

	async getTopRecent(params: RecentTopUsersSearchParams): Promise<ServerUser[]> {
		const url = new URL(`${GDPS_BASE_URL}/v2/users/top-recent`);

		if (params?.count !== undefined) {
			url.searchParams.set('count', params.count.toString());
		}

		if (params?.type !== undefined) {
			url.searchParams.set('type', params.type);
		}

		if (params?.max_version !== undefined) {
			url.searchParams.set('max_version', params.max_version.toString());
		}

		if (params?.daily !== undefined) {
			url.searchParams.set('daily', params.daily ? 'true' : 'false');
		}

		const data = await this.client.make_request(url);

		return validate(await data.json());
	}

	async getStatsHistory(id: number): Promise<ServerStatGain[]> {
		const data = await this.client.make_request(`${GDPS_BASE_URL}/v2/users/${id}/history`);
		return validate(await data.json());
	}

	async getBans(id: number): Promise<ServerBan[]> {
		this.client.require_auth();

		const data = await this.client.make_request(`${GDPS_BASE_URL}/v2/users/${id}/bans`);

		return validate(await data.json());
	}

	async createBan(id: number, type: BanType, reason: string) {
		this.client.require_auth();

		const data = await this.client.make_request(`${GDPS_BASE_URL}/v2/users/${id}/bans`, {
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			method: 'POST',
			body: JSON.stringify({ type, reason })
		});

		if (data.status == 201) {
			return;
		}

		validate(await data.json());
	}

	async removeBan(id: number, type: BanType) {
		this.client.require_auth();

		const data = await this.client.make_request(`${GDPS_BASE_URL}/v2/users/${id}/bans/${type}`, {
			method: 'DELETE'
		});

		if (data.status == 204) {
			return;
		}

		validate(await data.json());
	}
}
