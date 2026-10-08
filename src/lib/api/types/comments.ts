import { GDPS_BASE_URL, validate, type BaseClient, type ServerPaginated } from './base';
import type { ServerUser } from './users';

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

export type CommentsSearchSort =
	'timestamp' | 'body' | 'user_id' | 'user_name' | 'level_id' | 'likes';

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

export class CommentsManager {
	constructor(private client: BaseClient) {}

	async search(params?: CommentsSearchParams): Promise<ServerPaginated<ServerComment>> {
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

		const data = await this.client.make_request(url);
		return validate(await data.json());
	}

	async manage(comments: number[], type: 'delete' | 'hide' | 'unhide') {
		this.client.require_auth();

		const data = await this.client.make_request(`${GDPS_BASE_URL}/v2/comments/bulk-manage`, {
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
}
