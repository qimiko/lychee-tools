import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { GDPSClient, ServerError } from '$lib/api';
import { toIntSafe } from '$lib';

export const actions = {
	default: async ({ request, fetch, getClientAddress }) => {
		const formData = await request.formData();
		const key = formData.get('key');
		const account = formData.get('account');
		const password = formData.get('password');

		if (typeof key != 'string' || typeof account != 'string' || typeof password != 'string') {
			return fail(400, { error: 'Invalid information.' });
		}

		const account_id = toIntSafe(account);
		if (!account_id) {
			return fail(400, { error: 'Invalid account id.' });
		}

		const ip = getClientAddress();
		const client = new GDPSClient({ fetch, ip });

		try {
			await client.finishPasswordReset(key, account_id, password);

			return { success: true };
		} catch (e) {
			if (e instanceof ServerError) {
				if (e.type == 'invalid_request') {
					return fail(400, { error: 'Invalid data, make sure you entered everything correctly!' });
				}

				if (e.type == 'invalid_registration') {
					return fail(400, {
						error:
							'Invalid password, must be between 6-20 characters and not contain special characters.'
					});
				}

				if (e.type == 'unauthorized') {
					return fail(400, { error: 'Invalid token. Please try to send another reset email.' });
				}
			}

			return fail(400, { error: 'An unknown server error has happened, please try again!' });
		}
	}
} satisfies Actions;

export const load: PageServerLoad = async ({ url, fetch }) => {
	const key = url.searchParams.get('k');
	if (!key) {
		return error(400);
	}

	const client = new GDPSClient({ fetch });
	const accounts = await client.checkPasswordReset(key);

	if (accounts.length == 0) {
		return error(400);
	}

	return { accounts };
};
