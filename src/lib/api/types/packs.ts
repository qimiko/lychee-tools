import { GDPS_BASE_URL, validate, type BaseClient, type ServerPaginated } from './base';

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

export class MapPacksManager {
	constructor(private client: BaseClient) {}

	async getAll(): Promise<ServerPaginated<ServerMapPack>> {
		const data = await this.client.make_request(`${GDPS_BASE_URL}/v2/packs`);
		return validate(await data.json());
	}

	async create(
		name: string,
		levels: number[],
		stars: number,
		coins: number,
		difficulty: number,
		text_color: number,
		bar_color: number
	) {
		this.client.require_auth();

		const data = await this.client.make_request(`${GDPS_BASE_URL}/v2/packs`, {
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

	async edit(
		id: number,
		name?: string,
		levels?: number[],
		stars?: number,
		coins?: number,
		difficulty?: number,
		text_color?: number,
		bar_color?: number
	) {
		this.client.require_auth();

		const data = await this.client.make_request(`${GDPS_BASE_URL}/v2/packs/${id}`, {
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
}
