import type { BaseClient } from './types/base';
import { AuthenticationError } from './types/base';
import { UsersManager } from './types/users';
import { AuthManager } from './types/auth';
import { AccountsManager } from './types/accounts';
import { LevelsManager } from './types/levels';
import { CommentsManager } from './types/comments';
import { SongsManager } from './types/songs';
import { ActionsManager } from './types/actions';
import { MapPacksManager } from './types/packs';

export class GDPSClient implements BaseClient {
	#token: string | null;
	readonly #fetch: typeof fetch;
	readonly ip: string | null;

	accounts = new AccountsManager(this);
	self = new AuthManager(this);
	levels = new LevelsManager(this);
	users = new UsersManager(this);
	comments = new CommentsManager(this);
	songs = new SongsManager(this);
	actions = new ActionsManager(this);
	mapPacks = new MapPacksManager(this);

	constructor(options: { token?: string; fetch?: typeof fetch; ip?: string }) {
		this.#token = options.token ?? null;
		this.#fetch = options.fetch ?? fetch;
		this.ip = options.ip ?? null;
	}

	async make_request(url: string | Request | URL, init?: RequestInit) {
		const headers = new Headers(init?.headers ?? {});

		if (this.#token) {
			headers.set('Authorization', `Bearer ${this.#token}`);
		}

		if (this.ip) {
			headers.set('X-Forwarded-For', this.ip);
		}

		return this.#fetch(url, { ...init, headers });
	}

	require_auth(): void {
		if (!this.#token) {
			throw new AuthenticationError();
		}
	}

	login(token: string) {
		this.#token = token;
	}
}
