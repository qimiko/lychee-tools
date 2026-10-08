import { GDPS_BASE_URL, validate, type BaseClient, type ServerPaginated } from './base';

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

export type SongsSearchParams = {
	query?: string;
	page?: number;
	count?: number;
	reupload?: boolean;
};

export class SongsManager {
	constructor(private client: BaseClient) {}

	async get(id: number): Promise<ServerSong> {
		const data = await this.client.make_request(`${GDPS_BASE_URL}/v2/songs/${id}`);
		return validate(await data.json());
	}

	async edit(id: number, name?: string, author?: string, download?: string) {
		this.client.require_auth();

		const data = await this.client.make_request(`${GDPS_BASE_URL}/v2/songs/${id}`, {
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

	async reupload(url: string, name_override?: string, author_override?: string): Promise<number> {
		this.client.require_auth();

		const data = await this.client.make_request(`${GDPS_BASE_URL}/v2/songs/reupload`, {
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			method: 'POST',
			body: JSON.stringify({ url, name_override, author_override })
		});

		return validate(await data.json());
	}

	async search(params: SongsSearchParams): Promise<ServerPaginated<ServerSong>> {
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

		const data = await this.client.make_request(url);
		return validate(await data.json());
	}
}
