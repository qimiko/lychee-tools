import { GDPSClient, ServerError } from '$lib/api';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { resolve } from '$app/paths';

export const actions = {
	default: async ({ request, fetch, cookies, getClientAddress }) => {
		const formData = await request.formData();

		const username = formData.get('username');
		const password = formData.get('password');

		if (typeof password != 'string' || typeof username != 'string') {
			return fail(400, { error: 'Invalid information.', username: '' });
		}

		const ip = getClientAddress();
		const token = cookies.get('token');
		const client = new GDPSClient({ fetch, token, ip });

		try {
			await client.changeUsername(username, password);

			return { success: true, username };
		} catch (e) {
			if (e instanceof ServerError) {
				if (e.type == 'invalid_credentials') {
					return fail(400, { error: 'Incorrect password!' });
				}

				if (e.type == 'ratelimited') {
					return fail(400, { error: 'You are being ratelimited, try again later!' });
				}

				if (e.type == 'invalid_registration') {
					return fail(400, { error: 'Invalid username!' });
				}
			}

			return fail(400, { error: 'An unknown server error has happened, please try again!' });
		}
	}
} satisfies Actions;

export const load: PageServerLoad = async ({ cookies }) => {
	const token = cookies.get('token');
	if (!token) {
		const url_params = new URLSearchParams({ redirect: '/account/management/change-username' });
		redirect(303, resolve('/account/login') + `?${url_params}`);
	}
};
