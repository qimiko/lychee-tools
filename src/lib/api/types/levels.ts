import type { ServerUserMinimal } from './users';
import type { ServerSong } from './songs';
import { GDPS_BASE_URL, validate, type BaseClient, type ServerPaginated } from './base';

export type ServerLevelData = {
	uuid: string;
	created_at?: string;
	abandoned_since?: string;
	name: string;
	version: number;
	description: string;
	level_string?: string;
	audio_track: number;
	game_version: number;
	length: number;
	replay?: string;
	password: number;
	original_id: number;
	two_player: boolean;
	song_id: number | null;
	song?: ServerSong;
	capacity_string?: string;
	objects: number;
};

export type ServerLevel = {
	id: number;
	author: ServerUserMinimal;
	difficulty: number;
	downloads: number;
	likes: number;
	demon: boolean;
	stars: number;
	rating: number;
	auto: boolean;
	upload_date?: string;
	reuploaded?: boolean;
	revisions: ServerLevelData[];
};

export type ServerLevelSend = {
	id: string;
	time: string;
	by_user_id: number;
	by_username: string;
	level: number;
	difficulty: number;
	demon: boolean;
	auto: boolean;
	stars: number;
	rating: number;
	reason: string | null;
};

export type ServerLevelReport = {
	level: number;
	reported: number;
};

export type ServerLevelPointShareUser = {
	name: string;
	id: number;
};

export type ServerLevelPointShare = {
	id: number;
	creator_name: string;
	creator_id: string;
	shares: ServerLevelPointShareUser[];
};

export type SearchLevelType =
	| 'search_string'
	| 'most_downloaded'
	| 'most_liked'
	| 'trending'
	| 'recent'
	| 'user_levels'
	| 'featured'
	| 'magic'
	| 'map_pack'
	| 'awarded'
	| 'followed'
	| 'friends'
	| 'super'
	| 'reported'
	| 'list'
	| 'sent'
	| 'self_unlisted'
	| 'last_updated';

export type LevelSearchParams = {
	type?: SearchLevelType;
	page?: number;
	query?: string;
	no_points?: boolean;
	epic?: boolean;
	count?: number;
	diffs?: number[];
	lengths?: number[];
	star?: boolean;
	no_stars?: boolean;
	two_player?: boolean;
	original?: boolean;
	featured?: boolean;
	audio_track?: number;
	custom_song?: boolean;
	no_reupload?: boolean;
};

export type LevelDifficulty =
	'na' | 'easy' | 'normal' | 'hard' | 'harder' | 'insane' | 'demon' | 'auto';

export type LevelLength = 'tiny' | 'short' | 'medium' | 'long' | 'extra_long';

export type AdvancedLevelSortType =
	| 'rated'
	| 'uploaded'
	| 'downloads'
	| 'likes'
	| 'reported'
	| 'sent'
	| 'updated'
	| 'by_list'
	| 'random';

export type AdvancedSearchLevelData = {
	by_users?: number[];
	by_accounts?: number[];
	starts_with?: string;
	contains?: string;
	difficulties?: LevelDifficulty[];
	lengths?: LevelLength[];
	ids_in?: number[];
	ids_not_in?: number[];
	rating_min?: number;
	rating_max?: number;
	stars_min?: number;
	stars_max?: number;
	object_count_min?: number;
	object_count_max?: number;
	original_id?: number;
	two_player?: boolean;
	game_version_min?: number;
	game_version_max?: number;
	audio_track?: number;
	song_id?: number;
	custom_song?: boolean;
	no_creator_points?: boolean;
	reuploaded?: boolean;
	id_min?: number;
	id_max?: number;
	sent?: boolean;
	reported?: boolean;
	created_min?: string;
	created_max?: string;
	updated_min?: string;
	updated_max?: string;
	user_points_min?: number;
	user_points_max?: number;
	match_id?: number;
	unlisted?: boolean;
	sort?: AdvancedLevelSortType;
	reverse_sort?: boolean;
	page?: number;
	total?: number;
};

export class LevelsManager {
	constructor(private client: BaseClient) {}

	async search(params?: LevelSearchParams): Promise<ServerPaginated<ServerLevel>> {
		const url = new URL(`${GDPS_BASE_URL}/v2/levels`);

		if (params?.type !== undefined) {
			url.searchParams.set('type', params.type);
		}

		if (params?.page !== undefined) {
			url.searchParams.set('page', params.page.toString());
		}

		if (params?.query !== undefined) {
			url.searchParams.set('query', params.query);
		}

		if (params?.no_points !== undefined) {
			url.searchParams.set('no_points', params.no_points ? 'true' : 'false');
		}

		if (params?.epic !== undefined) {
			url.searchParams.set('epic', params.epic ? 'true' : 'false');
		}

		if (params?.count !== undefined) {
			url.searchParams.set('count', params.count.toString());
		}

		if (params?.star !== undefined) {
			url.searchParams.set('star', params.star ? 'true' : 'false');
		}

		if (params?.no_stars !== undefined) {
			url.searchParams.set('no_stars', params.no_stars ? 'true' : 'false');
		}

		if (params?.two_player !== undefined) {
			url.searchParams.set('two_player', params.two_player ? 'true' : 'false');
		}

		if (params?.original !== undefined) {
			url.searchParams.set('original', params.original ? 'true' : 'false');
		}

		if (params?.featured !== undefined) {
			url.searchParams.set('featured', params.featured ? 'true' : 'false');
		}

		if (params?.audio_track !== undefined) {
			url.searchParams.set('audio_track', params.audio_track.toString());
		}

		if (params?.custom_song !== undefined) {
			url.searchParams.set('custom_song', params.custom_song ? 'true' : 'false');
		}

		if (params?.diffs !== undefined) {
			for (const diff of params.diffs) {
				url.searchParams.append('diff', diff.toString());
			}
		}

		if (params?.lengths !== undefined) {
			for (const len of params.lengths) {
				url.searchParams.append('length', len.toString());
			}
		}

		if (params?.no_reupload !== undefined) {
			url.searchParams.set('no_reupload', params.no_reupload ? 'true' : 'false');
		}

		const data = await this.client.make_request(url);
		return validate(await data.json());
	}

	async searchAdvanced(params?: AdvancedSearchLevelData): Promise<ServerPaginated<ServerLevel>> {
		const data = await this.client.make_request(`${GDPS_BASE_URL}/v2/levels`, {
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			method: 'QUERY',
			body: JSON.stringify(params ?? {})
		});
		return validate(await data.json());
	}

	async get(id: number): Promise<ServerLevel> {
		const data = await this.client.make_request(`${GDPS_BASE_URL}/v2/levels/${id}`);

		return validate(await data.json());
	}

	async reupload(id: number, url: string): Promise<number> {
		this.client.require_auth();

		const data = await this.client.make_request(`${GDPS_BASE_URL}/v2/levels/reupload`, {
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			method: 'POST',
			body: JSON.stringify({ base_url: url, level_id: id })
		});

		return validate(await data.json());
	}

	async getSends(page?: number, count?: number): Promise<ServerPaginated<ServerLevelSend>> {
		const url = new URL(`${GDPS_BASE_URL}/v2/levels/sends`);

		if (count !== undefined) {
			url.searchParams.set('count', count.toString());
		}

		if (page !== undefined) {
			url.searchParams.set('page', page.toString());
		}

		const data = await this.client.make_request(url);
		return validate(await data.json());
	}

	async getMostReported(
		page?: number,
		count?: number
	): Promise<ServerPaginated<ServerLevelReport>> {
		const url = new URL(`${GDPS_BASE_URL}/v2/levels/most-reported`);

		if (count !== undefined) {
			url.searchParams.set('count', count.toString());
		}

		if (page !== undefined) {
			url.searchParams.set('page', page.toString());
		}

		const data = await this.client.make_request(url);
		return validate(await data.json());
	}

	async getSharedPoints(): Promise<ServerLevelPointShare[]> {
		const data = await this.client.make_request(`${GDPS_BASE_URL}/v2/levels/shared-points`);
		return validate(await data.json());
	}
}
