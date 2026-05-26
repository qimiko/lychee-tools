import { GDPS_BASE_URL } from '$env/static/private';

type ServerResultError = {
	type: string;
};

export type ServerInvalidRegistrationError = ServerResultError & {
	type: 'invalid_registration';
	error_code:
		| 'success'
		| 'generic'
		| 'username_taken'
		| 'email_taken'
		| 'username_too_long'
		| 'invalid_password'
		| 'invalid_email'
		| 'password_too_short'
		| 'username_too_short';
};

export type ServerReuploadFailedError = ServerResultError & {
	type: 'reupload_failed';
	error: 'generic' | 'fetch_failed' | 'reupload_exists' | 'invalid_data' | 'level_too_recent';
};

type ServerGenericResultError = ServerResultError & {
	type:
		| 'invalid_registration'
		| 'reupload_failed'
		| 'ratelimited'
		| 'unauthorized'
		| 'activation_required'
		| 'invalid_credentials'
		| 'invalid_request';
};

type ServerResultFull =
	| ServerInvalidRegistrationError
	| ServerReuploadFailedError
	| ServerGenericResultError;

type ServerResult<T, E extends ServerResultError = ServerResultFull> =
	| {
			success: false;
			error: E;
	  }
	| {
			success: true;
			data: T;
	  };

type ServerPaginated<T> = {
	items: T[];
	count: number;
};

type ServerLogin = { authkey: string };

export type ServerMe = {
	account_id: number;
	name: string;
	permission_level: number;
	user?: ServerUser;
};

export type ServerUserMinimal = {
	id: number;
	name: string;
	account: number | null;
};

export type TopStatType = 'stars' | 'demons' | 'secret_coins' | 'creator_points';

export type ServerMinimalAccountPair = {
	username: string;
	id: number;
};

export type ServerDevice = {
	id: string;
	origin_ip: string;
	created: string;
	device?: string;
};

export type ServerExtraAccountDetails = {
	devices: ServerDevice[];
	has_legacy_token: boolean;
	has_session: boolean;
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

export type ServerSong = {
	id: number;
	title: string;
	artist_id: number;
	artist_name: string;
	size: number;
	youtube?: string;
	artist_youtube?: string;
	artist_approved?: boolean;
	priority?: number;
	download: string;
	ingame_song_source: number;
};

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
	revisions: ServerLevelData[];
};

export type ServerComment = {
	id: number;
	level_id: number;
	author: ServerUser;
	body: string;
	likes: number;
	hidden: boolean;
	percent: number;
	created: string;
};

export type ServerStatGain = {
	id: string;
	stars: number;
	demons: number;
	coins: number;
	max_stars: number;
	timestamp: string;
};

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
	| ServerActionLegacyPackEdit;

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

export type ServerMapPack = {
	id: number;
	name: string;
	levels: number[];
	stars: number;
	coins: number;
	difficulty: number;
	text_color: number;
	bar_color: number;
};

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

export type BanType = 'leaderboard' | 'creator' | 'send' | 'comment';

export type ServerBan = {
	type: BanType;
	created: string;
	reason?: string;
};

export type SearchLevelType =
	| 'super'
	| 'self_unlisted'
	| 'search_string'
	| 'user_levels'
	| 'most_downloaded'
	| 'most_liked'
	| 'map_pack';

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
	no_star?: boolean;
	two_player?: boolean;
	original?: boolean;
	featured?: boolean;
	audio_track?: number;
	custom_song?: boolean;
	no_reupload?: boolean;
};

export type CommentsSearchSort =
	| 'timestamp'
	| 'body'
	| 'user_id'
	| 'user_name'
	| 'level_id'
	| 'likes';

export type CommentsSearchParams = {
	levels?: number[];
	users?: number[];
	exclude_users?: number[];
	includes?: string[];
	excludes?: string[];
	count?: number;
	page?: number;
	sort?: CommentsSearchSort;
	reverse?: boolean;
};

export type SongsSearchParams = {
	query?: string;
	page?: number;
	count?: number;
	reupload?: boolean;
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

export class AuthenticationError extends Error {
	constructor() {
		super('endpoint requires an authenticated user');
		this.name = 'AuthenticationError';
	}
}

export class ServerError<T extends ServerResultError = ServerGenericResultError> extends Error {
	constructor(
		public type: T['type'],
		public data: T
	) {
		super(`server returned error ${type}`);
		this.name = 'ServerError';
	}
}

function validate<T = unknown>(res: ServerResult<T>) {
	if (!res.success) {
		throw new ServerError(res.error.type, res.error);
	}

	return res.data;
}

export class GDPSClient {
	#token: string | null;
	readonly #fetch: typeof fetch;
	readonly ip: string | null;

	constructor(options: { token?: string; fetch?: typeof fetch; ip?: string }) {
		this.#token = options.token ?? null;
		this.#fetch = options.fetch ?? fetch;
		this.ip = options.ip ?? null;
	}

	async #make_request(url: string | Request | URL, init?: RequestInit) {
		const headers = new Headers(init?.headers ?? {});

		if (this.#token) {
			headers.set('Authorization', `Bearer ${this.#token}`);
		}

		if (this.ip) {
			headers.set('X-Forwarded-For', this.ip);
		}

		return this.#fetch(url, { ...init, headers });
	}

	async loginAccount(username: string, password: string) {
		const data = await this.#make_request(`${GDPS_BASE_URL}/v2/accounts/login`, {
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			method: 'POST',
			body: JSON.stringify({ username, password })
		});

		const body = validate<ServerLogin>(await data.json());
		this.#token = body.authkey;

		return body.authkey;
	}

	async registerAccount(username: string, password: string, email: string) {
		const data = await this.#make_request(`${GDPS_BASE_URL}/v2/accounts/register`, {
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			method: 'POST',
			body: JSON.stringify({ username, password, email })
		});

		if (data.status == 201) {
			return;
		}

		validate(await data.json());
	}

	async getAccount(id: number | 'me' = 'me') {
		if (id == 'me' && !this.#token) {
			throw new AuthenticationError();
		}

		const data = await this.#make_request(`${GDPS_BASE_URL}/v2/accounts/${id}`);

		if (data.status != 200) {
			throw new AuthenticationError();
		}

		return validate<ServerMe>(await data.json());
	}

	async promoteAccount(id: number, level: number) {
		if (!this.#token) {
			throw new AuthenticationError();
		}

		const data = await this.#make_request(`${GDPS_BASE_URL}/v2/accounts/${id}/promote`, {
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			method: 'POST',
			body: JSON.stringify({ permission_level: level })
		});

		if (data.status == 204) {
			return;
		}

		validate(await data.json());
	}

	async verifyAccount(id: number, reset: boolean = false) {
		if (!this.#token) {
			throw new AuthenticationError();
		}

		const data = await this.#make_request(`${GDPS_BASE_URL}/v2/accounts/${id}/verify`, {
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			method: 'POST',
			body: JSON.stringify({ reset })
		});

		if (data.status == 204) {
			return;
		}

		validate(await data.json());
	}

	async getExtraAccountDetails(): Promise<ServerExtraAccountDetails> {
		if (!this.#token) {
			throw new AuthenticationError();
		}

		const data = await this.#make_request(`${GDPS_BASE_URL}/v2/accounts/extra-info`);

		return validate(await data.json());
	}

	async createLegacyToken(password: string): Promise<{ token: string }> {
		if (!this.#token) {
			throw new AuthenticationError();
		}

		const data = await this.#make_request(`${GDPS_BASE_URL}/v2/accounts/create-legacy-token`, {
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			method: 'POST',
			body: JSON.stringify({ password })
		});

		return validate(await data.json());
	}

	async createSession() {
		if (!this.#token) {
			throw new AuthenticationError();
		}

		const data = await this.#make_request(`${GDPS_BASE_URL}/v2/accounts/session`, {
			method: 'POST'
		});

		if (data.status == 201) {
			return;
		}

		validate(await data.json());
	}

	async logout(all_devices: boolean = false) {
		if (!this.#token) {
			throw new AuthenticationError();
		}

		const url = new URL(`${GDPS_BASE_URL}/v2/accounts/logout`);
		if (all_devices) {
			url.searchParams.set('all', 'true');
		}

		const data = await this.#make_request(url, { method: 'POST' });

		if (data.status == 204) {
			return;
		}

		validate(await data.json());
	}

	async removeDevice(key: string) {
		if (!this.#token) {
			throw new AuthenticationError();
		}

		const data = await this.#make_request(`${GDPS_BASE_URL}/v2/accounts/devices/${key}`, {
			method: 'DELETE'
		});

		if (data.status == 204) {
			return;
		}

		validate(await data.json());
	}

	async changeUsername(username: string, password: string) {
		if (!this.#token) {
			throw new AuthenticationError();
		}

		const data = await this.#make_request(`${GDPS_BASE_URL}/v2/accounts/change-username`, {
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			method: 'POST',
			body: JSON.stringify({ username, password })
		});

		if (data.status == 204) {
			return;
		}

		validate(await data.json());
	}

	async changePassword(current_password: string, new_password: string) {
		if (!this.#token) {
			throw new AuthenticationError();
		}

		const data = await this.#make_request(`${GDPS_BASE_URL}/v2/accounts/change-password`, {
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			method: 'POST',
			body: JSON.stringify({ current_password, new_password })
		});

		if (data.status == 204) {
			return;
		}

		validate(await data.json());
	}

	async beginPasswordReset(email: string, challenge: string, verification: boolean = false) {
		const data = await this.#make_request(`${GDPS_BASE_URL}/v2/accounts/begin-reset`, {
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			method: 'POST',
			body: JSON.stringify({ email, challenge, verification })
		});

		if (data.status == 201) {
			return;
		}

		validate(await data.json());
	}

	async checkPasswordReset(token: string): Promise<ServerMinimalAccountPair[]> {
		const data = await this.#make_request(`${GDPS_BASE_URL}/v2/accounts/check-reset`, {
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			method: 'POST',
			body: JSON.stringify({ token })
		});

		return validate(await data.json());
	}

	async finishPasswordReset(token: string, account_id: number, password: string) {
		const data = await this.#make_request(`${GDPS_BASE_URL}/v2/accounts/finish-reset`, {
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			method: 'POST',
			body: JSON.stringify({ token, account_id, password })
		});

		if (data.status == 204) {
			return;
		}

		validate(await data.json());
	}

	async finishVerification(token: string, challenge: string) {
		const data = await this.#make_request(`${GDPS_BASE_URL}/v2/accounts/finish-verification`, {
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			method: 'POST',
			body: JSON.stringify({ token, challenge })
		});

		if (data.status == 204) {
			return;
		}

		validate(await data.json());
	}

	async searchLevels(params?: LevelSearchParams): Promise<ServerPaginated<ServerLevel>> {
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

		if (params?.no_star !== undefined) {
			url.searchParams.set('no_star', params.no_star ? 'true' : 'false');
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

		const data = await this.#make_request(url);
		return validate(await data.json());
	}

	async getLevel(id: number): Promise<ServerLevel> {
		const data = await this.#make_request(`${GDPS_BASE_URL}/v2/levels/${id}`);

		return validate(await data.json());
	}

	async reuploadLevel(id: number, url: string): Promise<number> {
		if (!this.#token) {
			throw new AuthenticationError();
		}

		const data = await this.#make_request(`${GDPS_BASE_URL}/v2/levels/reupload`, {
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			method: 'POST',
			body: JSON.stringify({ base_url: url, level_id: id })
		});

		return validate(await data.json());
	}

	async getUser(id: number): Promise<ServerUser> {
		const data = await this.#make_request(`${GDPS_BASE_URL}/v2/users/${id}`);

		return validate(await data.json());
	}

	async searchUsers(
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

		const data = await this.#make_request(url);
		return validate(await data.json());
	}

	async getTopUsers(type: TopStatType = 'stars', count = 250): Promise<ServerUser[]> {
		const url = new URL(`${GDPS_BASE_URL}/v2/users/top`);
		url.searchParams.set('type', type);
		url.searchParams.set('count', count.toString());

		const data = await this.#make_request(url);
		return validate(await data.json());
	}

	async getTopRecentUsers(
		type: TopStatType = 'stars',
		count = 250,
		daily = false
	): Promise<ServerUser[]> {
		const url = new URL(`${GDPS_BASE_URL}/v2/users/top-recent`);
		url.searchParams.set('type', type);
		url.searchParams.set('count', count.toString());
		url.searchParams.set('daily', daily ? 'true' : 'false');

		const data = await this.#make_request(url);

		return validate(await data.json());
	}

	async searchComments(params?: CommentsSearchParams): Promise<ServerPaginated<ServerComment>> {
		const url = new URL(`${GDPS_BASE_URL}/v2/comments`);

		if (params?.levels) {
			for (const level of params.levels) {
				url.searchParams.append('level', level.toString());
			}
		}

		if (params?.users) {
			for (const user of params.users) {
				url.searchParams.append('user', user.toString());
			}
		}

		if (params?.exclude_users) {
			for (const user of params.exclude_users) {
				url.searchParams.append('exclude_user', user.toString());
			}
		}

		if (params?.includes) {
			for (const include of params.includes) {
				url.searchParams.append('include', include);
			}
		}

		if (params?.excludes) {
			for (const exclude of params.excludes) {
				url.searchParams.append('exclude', exclude);
			}
		}

		if (params?.count !== undefined) {
			url.searchParams.set('count', params.count.toString());
		}

		if (params?.page !== undefined) {
			url.searchParams.set('page', params.page.toString());
		}

		if (params?.sort !== undefined) {
			url.searchParams.set('sort', params.sort);
		}

		if (params?.reverse !== undefined) {
			url.searchParams.set('reverse', params.reverse ? 'true' : 'false');
		}

		const data = await this.#make_request(url);
		return validate(await data.json());
	}

	async manageComments(comments: number[], type: 'delete' | 'hide' | 'unhide') {
		if (!this.#token) {
			throw new AuthenticationError();
		}

		const data = await this.#make_request(`${GDPS_BASE_URL}/v2/comments/bulk-manage`, {
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			method: 'POST',
			body: JSON.stringify({ comments, type })
		});

		if (data.status == 204) {
			return;
		}

		validate(await data.json());
	}

	async getSong(id: number): Promise<ServerSong> {
		const data = await this.#make_request(`${GDPS_BASE_URL}/v2/songs/${id}`);
		return validate(await data.json());
	}

	async editSong(id: number, name?: string, author?: string, download?: string) {
		if (!this.#token) {
			throw new AuthenticationError();
		}

		const data = await this.#make_request(`${GDPS_BASE_URL}/v2/songs/${id}`, {
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			method: 'PATCH',
			body: JSON.stringify({ name, author, download })
		});

		if (data.status == 204) {
			return;
		}

		validate(await data.json());
	}

	async reuploadSong(
		url: string,
		name_override?: string,
		author_override?: string
	): Promise<number> {
		if (!this.#token) {
			throw new AuthenticationError();
		}

		const data = await this.#make_request(`${GDPS_BASE_URL}/v2/songs/reupload`, {
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			method: 'POST',
			body: JSON.stringify({ url, name_override, author_override })
		});

		return validate(await data.json());
	}

	async getStatsHistory(id: number): Promise<ServerStatGain[]> {
		const data = await this.#make_request(`${GDPS_BASE_URL}/v2/users/${id}/history`);
		return validate(await data.json());
	}

	async getUserBans(id: number): Promise<ServerBan[]> {
		if (!this.#token) {
			throw new AuthenticationError();
		}

		const data = await this.#make_request(`${GDPS_BASE_URL}/v2/users/${id}/bans`);

		return validate(await data.json());
	}

	async createBan(id: number, type: BanType, reason: string) {
		if (!this.#token) {
			throw new AuthenticationError();
		}

		const data = await this.#make_request(`${GDPS_BASE_URL}/v2/users/${id}/bans`, {
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
		if (!this.#token) {
			throw new AuthenticationError();
		}

		const data = await this.#make_request(`${GDPS_BASE_URL}/v2/users/${id}/bans/${type}`, {
			method: 'DELETE'
		});

		if (data.status == 204) {
			return;
		}

		validate(await data.json());
	}

	async searchSongs(params: SongsSearchParams): Promise<ServerPaginated<ServerSong>> {
		const url = new URL(`${GDPS_BASE_URL}/v2/songs`);

		if (params?.count !== undefined) {
			url.searchParams.set('count', params.count.toString());
		}

		if (params?.page !== undefined) {
			url.searchParams.set('page', params.page.toString());
		}

		if (params?.query !== undefined) {
			url.searchParams.set('query', params.query);
		}

		if (params?.reupload !== undefined) {
			url.searchParams.set('reupload', params.reupload ? 'true' : 'false');
		}

		const data = await this.#make_request(url);
		return validate(await data.json());
	}

	async getFullStats(): Promise<ServerStats> {
		const data = await this.#make_request(`${GDPS_BASE_URL}/v2/stats`);
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

		const data = await this.#make_request(url);
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

		const data = await this.#make_request(url);
		return validate(await data.json());
	}

	async getSharedPoints(): Promise<ServerLevelPointShare[]> {
		const data = await this.#make_request(`${GDPS_BASE_URL}/v2/levels/shared-points`);
		return validate(await data.json());
	}

	async getAllMapPacks(): Promise<ServerPaginated<ServerMapPack>> {
		const data = await this.#make_request(`${GDPS_BASE_URL}/v2/packs`);
		return validate(await data.json());
	}

	async createMapPack(
		name: string,
		levels: number[],
		stars: number,
		coins: number,
		difficulty: number,
		text_color: number,
		bar_color: number
	) {
		if (!this.#token) {
			throw new AuthenticationError();
		}

		const data = await this.#make_request(`${GDPS_BASE_URL}/v2/packs`, {
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			method: 'POST',
			body: JSON.stringify({ name, levels, stars, coins, difficulty, text_color, bar_color })
		});

		if (data.status == 201) {
			return;
		}

		validate(await data.json());
	}

	async editMapPack(
		id: number,
		name?: string,
		levels?: number[],
		stars?: number,
		coins?: number,
		difficulty?: number,
		text_color?: number,
		bar_color?: number
	) {
		if (!this.#token) {
			throw new AuthenticationError();
		}

		const data = await this.#make_request(`${GDPS_BASE_URL}/v2/packs/${id}`, {
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			method: 'PATCH',
			body: JSON.stringify({ name, levels, stars, coins, difficulty, text_color, bar_color })
		});

		if (data.status == 204) {
			return;
		}

		validate(await data.json());
	}

	async getLatestUpdate(): Promise<ServerUpdate> {
		const data = await this.#make_request(`${GDPS_BASE_URL}/v2/latest-update`);
		return validate(await data.json());
	}

	async runTask(name: string) {
		if (!this.#token) {
			throw new AuthenticationError();
		}

		const data = await this.#make_request(`${GDPS_BASE_URL}/v2/cron/${name}`, {
			method: 'POST'
		});

		if (data.status == 202) {
			return;
		}

		validate(await data.json());
	}

	async getTasks(): Promise<ServerTask[]> {
		if (!this.#token) {
			throw new AuthenticationError();
		}

		const data = await this.#make_request(`${GDPS_BASE_URL}/v2/cron`);
		return validate(await data.json());
	}

	async getTopActions(): Promise<ServerTopActionUser[]> {
		if (!this.#token) {
			throw new AuthenticationError();
		}

		const data = await this.#make_request(`${GDPS_BASE_URL}/v2/actions/top`);
		return validate(await data.json());
	}

	async searchActions(params?: ActionsSearchParams): Promise<ServerPaginated<ServerAction>> {
		if (!this.#token) {
			throw new AuthenticationError();
		}

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

		const data = await this.#make_request(url);
		return validate(await data.json());
	}
}
