import { GDPSClient, ServerError } from '$lib/api';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { resolve } from '$app/paths';

export const actions = {
	default: async ({ request, fetch, cookies, getClientAddress }) => {
		const formData = await request.formData();
		const password = formData.get('password');

		if (typeof password != 'string') {
			return fail(400, { error: 'Invalid information.' });
		}

		const ip = getClientAddress();

		const token = cookies.get('token');
		const client = new GDPSClient({ fetch, token, ip });

		try {
			const { token } = await client.createLegacyToken(password);

			return { success: true, token };
		} catch (e) {
			if (e instanceof ServerError) {
				if (e.type == 'invalid_credentials') {
					return fail(400, { error: 'Incorrect password!' });
				}

				if (e.type == 'ratelimited') {
					return fail(400, { error: 'You are being ratelimited, try again later!' });
				}
			}

			return fail(400, { error: 'An unknown server error has happened, please try again!' });
		}
	}
} satisfies Actions;

export const load: PageServerLoad = async ({ cookies, fetch }) => {
	const token = cookies.get('token');
	if (!token) {
		const url_params = new URLSearchParams({ redirect: '/account/management/legacy-token' });
		redirect(303, resolve('/account/login') + `?${url_params}`);
	}

	const client = new GDPSClient({ token, fetch });

	let extra_details;
	try {
		// handle if we get logged out here
		extra_details = await client.getExtraAccountDetails();
	} catch {
		const url_params = new URLSearchParams({ redirect: '/account/management' });
		redirect(303, resolve('/account/login') + `?${url_params}`);
	}

	return { extra_details };
};
