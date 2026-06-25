import { GDPSClient, ServerError } from '$lib/api';
import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { resolve } from '$app/paths';

export const actions = {
	role: async ({ request, fetch, cookies, params, getClientAddress }) => {
		const id = +params.id;

		const formData = await request.formData();
		const level = formData.get('level');

		if (typeof level != 'string' || !id) {
			return fail(400, { error: 'Invalid account!' });
		}

		const token = cookies.get('token');
		const ip = getClientAddress();
		const client = new GDPSClient({ fetch, token, ip });

		try {
			await client.promoteAccount(id, +level);
			return { success: true };
		} catch (e) {
			if (e instanceof ServerError) {
				if (e.type == 'unauthorized') {
					return fail(400, { error: 'You are not allowed to perform this action!' });
				}

				if (e.type == 'activation_required') {
					return fail(400, { error: '🫪' });
				}
			}

			return fail(400, { error: 'An unknown server error has happened, please try again!' });
		}
	},
	verify: async ({ request, fetch, cookies, params, getClientAddress }) => {
		const id = +params.id;

		const formData = await request.formData();
		const reset = formData.get('reset');

		if (typeof reset != 'string' || !id) {
			return fail(400, { error: 'Invalid ban type!', type: 'remove_ban' });
		}

		const ip = getClientAddress();
		const token = cookies.get('token');
		const client = new GDPSClient({ fetch, token, ip });

		try {
			await client.verifyAccount(id, reset == '1');
			return { success: true };
		} catch {
			return fail(400, { error: 'An unknown server error has happened, please try again!' });
		}
	},
	change_username: async ({ request, fetch, cookies, getClientAddress, params }) => {
		const id = +params.id;

		const formData = await request.formData();

		const username = formData.get('username');

		if (typeof username != 'string' || !id) {
			return fail(400, { error: 'Invalid information.', username: '' });
		}

		const ip = getClientAddress();
		const token = cookies.get('token');
		const client = new GDPSClient({ fetch, token, ip });

		try {
			await client.changeAccountUsername(id, username);

			return { success: true, username };
		} catch (e) {
			if (e instanceof ServerError) {
				if (e.type == 'invalid_registration') {
					return fail(400, { error: 'Invalid username!' });
				}
			}

			return fail(400, { error: 'An unknown server error has happened, please try again!' });
		}
	}
} satisfies Actions;

export const load: PageServerLoad = async ({ fetch, params, cookies, getClientAddress }) => {
	const id = +params.id;
	if (!id) {
		return error(404);
	}

	const token = cookies.get('token');
	if (!token) {
		const url_params = new URLSearchParams({ redirect: `/accounts/${id}/manage` });
		return redirect(303, resolve('/account/login') + `?${url_params}`);
	}

	const ip = getClientAddress();
	const client = new GDPSClient({ token, fetch, ip });

	const account = await client.getAccount(id);

	return { account };
};
