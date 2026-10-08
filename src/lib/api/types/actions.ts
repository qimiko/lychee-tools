import { GDPS_BASE_URL, validate, type BaseClient, type ServerPaginated } from './base';
import type { BanType } from './users';

export type ServerStatsLevelRow = {
	total: number;
	unrated: number;
	rated: number;
	featured: number;
	epic: number;
};

export type ServerStats = {
	level: {
		total: ServerStatsLevelRow;
		na: ServerStatsLevelRow;
		auto: ServerStatsLevelRow;
		easy: ServerStatsLevelRow;
		normal: ServerStatsLevelRow;
		hard: ServerStatsLevelRow;
		harder: ServerStatsLevelRow;
		insane: ServerStatsLevelRow;
		demon: ServerStatsLevelRow;
	};
	account: {
		users: number;
		registered: number;
		total_actions: number;
		active_this_month: number;
		active_this_week: number;
	};
	comment: {
		everyone: number;
		moderators: number;
	};
	leaderboard: {
		unbanned: number;
		banned: number;
		stars_collected: number;
		coins_collected: number;
		demons_completed: number;
		points_rewarded: number;
	};
};

export type ServerTopActionUser = {
	username: string;
	id: number;
	permissions: number;
	all_actions: number;
	rate_actions: number;
};

export type ActionType =
	| 'level_rate'
	| 'level_update'
	| 'level_upload'
	| 'level_edit'
	| 'level_publicity'
	| 'legacy_pack_edit'
	| 'pack_create'
	| 'pack_edit'
	| 'level_reupload'
	| 'level_delete'
	| 'comment_delete'
	| 'comment_bulk_manage'
	| 'legacy_level_account'
	| 'legacy_share_points'
	| 'clear_shared_points'
	| 'share_points'
	| 'create_ban'
	| 'remove_ban'
	| 'song_reupload'
	| 'song_edit'
	| 'account_edit';

export type BaseServerAction = {
	id: string;
	on_id?: number;
	ip?: string;
	account_id: number | null;
	user_id: number | null;
	timestamp: string;
};

export type ServerActionLegacyPackEdit = BaseServerAction & {
	type: 'legacy_pack_edit';
	value1: {
		name: string;
		levels: string;
		stars: number;
		coins: number;
		color: number;
	};
};

export type ServerActionLegacySharePoints = BaseServerAction & {
	type: 'legacy_share_points';
	value1: string;
};

export type ServerActionLegacyLevelAccount = BaseServerAction & {
	type: 'legacy_level_account';
	value1: string;
};

export type ServerActionLevelUpdate = BaseServerAction & {
	type: 'level_update';
	value1: {
		data_id: string;
	};
	value2: {
		data_id: string | null;
	};
};

export type ServerActionLevelUpload = BaseServerAction & {
	type: 'level_upload';
	value1?: {
		data_id: string;
	};
};

export type ServerActionCommentDelete = BaseServerAction & {
	type: 'comment_delete';
};

export type ServerActionLevelDelete = BaseServerAction & {
	type: 'level_delete';
	value1: {
		reason: string | null;
	};
};

export type ServerActionLevelRate = BaseServerAction & {
	type: 'level_rate';
	value1: {
		stars?: number;
		difficulty?: string;
		rating?: number;
		disable_host_points?: boolean;
	};
};

export type ServerActionSharePoints = BaseServerAction & {
	type: 'share_points';
	value1: {
		target: number;
	};
};

export type ServerActionClearSharedPoints = BaseServerAction & {
	type: 'clear_shared_points';
};

export type ServerActionLevelEdit = BaseServerAction & {
	type: 'level_edit';
	value1: {
		author?: number;
		name?: string;
		password?: number;
		song_id?: number;
		description?: string;
	};
	value2: {
		author?: number;
		name?: string;
		password?: number;
		song_id?: number;
		description?: string;
	};
};

export type ServerActionPublicityChange = BaseServerAction & {
	type: 'level_publicity';
	value1: {
		unlisted: boolean;
	};
};

export type ServerActionCreateBan = BaseServerAction & {
	type: 'create_ban';
	value1: {
		type: BanType;
	};
};

export type ServerActionRemoveBan = BaseServerAction & {
	type: 'remove_ban';
	value1: {
		type: BanType;
	};
};

export type ServerActionSongEdit = BaseServerAction & {
	type: 'song_edit';
	value1: {
		name?: string;
		author?: string;
		download?: string;
	};
	value2: {
		name?: string;
		author?: string;
		download?: string;
	};
};

export type ServerActionPackCreate = BaseServerAction & {
	type: 'pack_create';
};

export type ServerActionPackEdit = BaseServerAction & {
	type: 'pack_edit';
	value1: {
		name?: string;
		levels?: number[];
		stars?: number;
		coins?: number;
		difficulty?: number;
		text_color?: number;
		bar_color?: number;
	};
	value2: {
		name?: string;
		levels?: number[];
		stars?: number;
		coins?: number;
		difficulty?: number;
		text_color?: number;
		bar_color?: number;
	};
};

export type ServerActionBulkCommentManage = BaseServerAction & {
	type: 'comment_bulk_manage';
	value1: {
		ids: number[];
		type: string;
	};
};

export type ServerActionAccountEdit = BaseServerAction & {
	type: 'account_edit';
	value1: {
		username?: string;
		password?: boolean;
		permission_level?: number;
		verified?: boolean;
	};
};

export type ServerActionLevelReupload = BaseServerAction & {
	type: 'level_reupload';
	value1: {
		level_id: number;
	};
};

export type ServerActionSongReupload = BaseServerAction & {
	type: 'song_reupload';
	value1: {
		url: string;
	};
};

export type ServerActionAccountDelete = BaseServerAction & {
	type: 'account_delete';
};

export type ServerAction =
	| ServerActionLevelReupload
	| ServerActionSongReupload
	| ServerActionAccountEdit
	| ServerActionBulkCommentManage
	| ServerActionPackEdit
	| ServerActionSongEdit
	| ServerActionRemoveBan
	| ServerActionCreateBan
	| ServerActionPublicityChange
	| ServerActionLevelEdit
	| ServerActionClearSharedPoints
	| ServerActionSharePoints
	| ServerActionLevelRate
	| ServerActionLevelDelete
	| ServerActionCommentDelete
	| ServerActionLevelUpload
	| ServerActionLevelUpdate
	| ServerActionLegacyLevelAccount
	| ServerActionLegacySharePoints
	| ServerActionLegacyPackEdit
	| ServerActionAccountDelete;

export type ServerUpdate = {
	version: string;
	links: {
		windows: string;
		windows_portable: string;
		android: string;
	};
};

export type ServerTask = {
	name: string;
	last_executed?: string;
	next_execution?: string;
};

export type ActionsSearchParams = {
	types?: ActionType[];
	count?: number;
	page?: number;

	on_id?: number;
	by_user?: number;
	by_account?: number;
	by_ip?: string;
};

export class ActionsManager {
	constructor(private client: BaseClient) {}

	async getFullStats(): Promise<ServerStats> {
		const data = await this.client.make_request(`${GDPS_BASE_URL}/v2/stats`);
		return validate(await data.json());
	}

	async getLatestUpdate(): Promise<ServerUpdate> {
		const data = await this.client.make_request(`${GDPS_BASE_URL}/v2/latest-update`);
		return validate(await data.json());
	}

	async runTask(name: string) {
		this.client.require_auth();

		const data = await this.client.make_request(`${GDPS_BASE_URL}/v2/cron/${name}`, {
			method: 'POST'
		});

		if (data.status == 202) {
			return;
		}

		validate(await data.json());
	}

	async getTasks(): Promise<ServerTask[]> {
		this.client.require_auth();

		const data = await this.client.make_request(`${GDPS_BASE_URL}/v2/cron`);
		return validate(await data.json());
	}

	async getTop(): Promise<ServerTopActionUser[]> {
		this.client.require_auth();

		const data = await this.client.make_request(`${GDPS_BASE_URL}/v2/actions/top`);
		return validate(await data.json());
	}

	async search(params?: ActionsSearchParams): Promise<ServerPaginated<ServerAction>> {
		this.client.require_auth();

		const url = new URL(`${GDPS_BASE_URL}/v2/actions`);

		if (params?.types) {
			for (const type of params.types) {
				url.searchParams.append('type', type);
			}
		}

		if (params?.page !== undefined) {
			url.searchParams.set('page', params.page.toString());
		}

		if (params?.count !== undefined) {
			url.searchParams.set('count', params.count.toString());
		}

		if (params?.on_id !== undefined) {
			url.searchParams.set('on_id', params.on_id.toString());
		}

		if (params?.by_user !== undefined) {
			url.searchParams.set('by_user', params.by_user.toString());
		}

		if (params?.by_account !== undefined) {
			url.searchParams.set('by_account', params.by_account.toString());
		}

		const data = await this.client.make_request(url);
		return validate(await data.json());
	}
}
