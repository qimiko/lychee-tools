import { env } from '$env/dynamic/private';
const GDPS_BASE_URL = env.GDPS_BASE_URL;

export { GDPS_BASE_URL };

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

export type ServerInvalidEmailError = ServerResultError & {
	type: 'invalid_email';
	message: string | null;
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
	| ServerGenericResultError
	| ServerInvalidEmailError;

export type ServerResult<T, E extends ServerResultError = ServerResultFull> =
	| {
			success: false;
			error: E;
	  }
	| {
			success: true;
			data: T;
	  };

export type ServerPaginated<T> = {
	items: T[];
	count: number;
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

export function validate<T = unknown>(res: ServerResult<T>) {
	if (!res.success) {
		throw new ServerError(res.error.type, res.error);
	}

	return res.data;
}

export interface BaseClient {
	make_request(url: string | Request | URL, init?: RequestInit): Promise<Response>;
	require_auth(): void;
	login(token: string): void;
}
