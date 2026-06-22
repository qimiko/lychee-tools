import { GDPSClient, ServerError } from '$lib/api';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { resolve } from '$app/paths';

export const actions = {
	default: async ({ request, fetch, cookies, getClientAddress }) => {
		const formData = await request.formData();

		const current_password = formData.get('current_password');
		const new_password = formData.get('new_password');

		if (typeof current_password != 'string' || typeof new_password != 'string') {
			return fail(400, { error: 'Invalid information.' });
		}

		const ip = getClientAddress();
		const token = cookies.get('token');
		const client = new GDPSClient({ fetch, token, ip });

		try {
			await client.changePassword(current_password, new_password);
		} catch (e) {
			if (e instanceof ServerError) {
				if (e.type == 'invalid_credentials') {
					return fail(400, { error: 'Incorrect password!' });
				}

				if (e.type == 'ratelimited') {
					return fail(400, { error: 'You are being ratelimited, try again later!' });
				}

				if (e.type == 'invalid_registration') {
					return fail(400, {
						error:
							'Invalid new password, must be between 6 - 20 characters and not contain special characters.'
					});
				}
			}

			return fail(400, { error: 'An unknown server error has happened, please try again!' });
		}

		cookies.delete('token', {
			path: '/',
			maxAge: 2592000
		});
		return redirect(302, '/tools?logout=true');
	}
} satisfies Actions;

export const load: PageServerLoad = async ({ cookies }) => {
	const token = cookies.get('token');
	if (!token) {
		const url_params = new URLSearchParams({ redirect: '/account/management/change-password' });
		redirect(303, resolve('/account/login') + `?${url_params}`);
	}
};
