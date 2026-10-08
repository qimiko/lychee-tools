import type { BaseClient, ServerPaginated } from './base';
import { AuthenticationError, GDPS_BASE_URL, validate } from './base';
import type { ServerUser } from './users';

export type ServerMinimalAccount = {
	username: string;
	id: number;
	user_id: number | null;
	created: string;
};

export type ServerMe = {
	account_id: number;
	name: string;
	permission_level: number;
	user?: ServerUser;
};

export type AccountsSearchParams = {
	query?: string;
	page?: number;
	count?: number;
	sort?: 'registered' | 'name';
};

export class AccountsManager {
	constructor(private client: BaseClient) {}

	async search(params: AccountsSearchParams) {
		const url = new URL(`${GDPS_BASE_URL}/v2/accounts`);

		if (params.count !== undefined) {
			url.searchParams.set('count', params.count.toString());
		}

		if (params.page !== undefined) {
			url.searchParams.set('page', params.page.toString());
		}

		if (params.query !== undefined) {
			url.searchParams.set('query', params.query);
		}

		if (params.sort !== undefined) {
			url.searchParams.set('sort', params.sort);
		}

		const data = await this.client.make_request(url);
		return validate<ServerPaginated<ServerMinimalAccount>>(await data.json());
	}

	async get(id: number | 'me' = 'me') {
		if (id == 'me') {
			this.client.require_auth();
		}

		const data = await this.client.make_request(`${GDPS_BASE_URL}/v2/accounts/${id}`);

		if (data.status != 200) {
			throw new AuthenticationError();
		}

		return validate<ServerMe>(await data.json());
	}

	async requestDeletion(id: number) {
		this.client.require_auth();

		const data = await this.client.make_request(`${GDPS_BASE_URL}/v2/accounts/${id}`, {
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			method: 'DELETE'
		});

		if (data.status == 204) {
			return;
		}

		validate(await data.json());
	}

	async changeUsername(id: number, username: string) {
		this.client.require_auth();

		const data = await this.client.make_request(
			`${GDPS_BASE_URL}/v2/accounts/${id}/change-username`,
			{
				headers: new Headers({
					'Content-Type': 'application/json'
				}),
				method: 'POST',
				body: JSON.stringify({ username })
			}
		);

		if (data.status == 204) {
			return;
		}

		validate(await data.json());
	}

	async promote(id: number, level: number) {
		this.client.require_auth();

		const data = await this.client.make_request(`${GDPS_BASE_URL}/v2/accounts/${id}/promote`, {
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

	async verify(id: number, reset: boolean = false) {
		this.client.require_auth();

		const data = await this.client.make_request(`${GDPS_BASE_URL}/v2/accounts/${id}/verify`, {
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
}
