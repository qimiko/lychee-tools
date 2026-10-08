import { validate, type BaseClient } from './base';
import { GDPS_BASE_URL } from './base';

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
	email: string;
	email_verified: boolean;
	save_size: number | null;
};

export type ServerLogin = { authkey: string };

export class AuthManager {
	constructor(private client: BaseClient) {}

	async login(username: string, password: string) {
		const data = await this.client.make_request(`${GDPS_BASE_URL}/v2/accounts/login`, {
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			method: 'POST',
			body: JSON.stringify({ username, password })
		});

		const body = validate<ServerLogin>(await data.json());
		this.client.login(body.authkey);

		return body.authkey;
	}

	async register(username: string, password: string, email: string, challenge: string) {
		const data = await this.client.make_request(`${GDPS_BASE_URL}/v2/accounts/register`, {
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			method: 'POST',
			body: JSON.stringify({ username, password, email, challenge })
		});

		if (data.status == 201) {
			return;
		}

		validate(await data.json());
	}

	async getExtraDetails(): Promise<ServerExtraAccountDetails> {
		this.client.require_auth();

		const data = await this.client.make_request(`${GDPS_BASE_URL}/v2/accounts/extra-info`);

		return validate(await data.json());
	}

	async createLegacyToken(password: string): Promise<{ token: string }> {
		this.client.require_auth();

		const data = await this.client.make_request(
			`${GDPS_BASE_URL}/v2/accounts/create-legacy-token`,
			{
				headers: new Headers({
					'Content-Type': 'application/json'
				}),
				method: 'POST',
				body: JSON.stringify({ password })
			}
		);

		return validate(await data.json());
	}

	async createSession() {
		this.client.require_auth();

		const data = await this.client.make_request(`${GDPS_BASE_URL}/v2/accounts/session`, {
			method: 'POST'
		});

		if (data.status == 201) {
			return;
		}

		validate(await data.json());
	}

	async logout(all_devices: boolean = false) {
		this.client.require_auth();

		const url = new URL(`${GDPS_BASE_URL}/v2/accounts/logout`);
		if (all_devices) {
			url.searchParams.set('all', 'true');
		}

		const data = await this.client.make_request(url, { method: 'POST' });

		if (data.status == 204) {
			return;
		}

		validate(await data.json());
	}

	async removeDevice(key: string) {
		this.client.require_auth();

		const data = await this.client.make_request(`${GDPS_BASE_URL}/v2/accounts/devices/${key}`, {
			method: 'DELETE'
		});

		if (data.status == 204) {
			return;
		}

		validate(await data.json());
	}

	async changeUsername(username: string, password: string) {
		this.client.require_auth();

		const data = await this.client.make_request(`${GDPS_BASE_URL}/v2/accounts/change-username`, {
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
		this.client.require_auth();

		const data = await this.client.make_request(`${GDPS_BASE_URL}/v2/accounts/change-password`, {
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

	async requestDeletion(password: string) {
		this.client.require_auth();

		const data = await this.client.make_request(`${GDPS_BASE_URL}/v2/accounts/request-deletion`, {
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			method: 'POST',
			body: JSON.stringify({ password })
		});

		if (data.status == 201) {
			return;
		}

		validate(await data.json());
	}

	async continueDeletion(token: string) {
		const data = await this.client.make_request(`${GDPS_BASE_URL}/v2/accounts/finish-deletion`, {
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			method: 'POST',
			body: JSON.stringify({ token })
		});

		if (data.status == 204) {
			return;
		}

		validate(await data.json());
	}

	async beginPasswordReset(email: string, challenge: string, verification: boolean = false) {
		const data = await this.client.make_request(`${GDPS_BASE_URL}/v2/accounts/begin-reset`, {
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
		const data = await this.client.make_request(`${GDPS_BASE_URL}/v2/accounts/check-reset`, {
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			method: 'POST',
			body: JSON.stringify({ token })
		});

		return validate(await data.json());
	}

	async finishPasswordReset(token: string, account_id: number, password: string) {
		const data = await this.client.make_request(`${GDPS_BASE_URL}/v2/accounts/finish-reset`, {
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
		const data = await this.client.make_request(
			`${GDPS_BASE_URL}/v2/accounts/finish-verification`,
			{
				headers: new Headers({
					'Content-Type': 'application/json'
				}),
				method: 'POST',
				body: JSON.stringify({ token, challenge })
			}
		);

		if (data.status == 204) {
			return;
		}

		validate(await data.json());
	}
}
