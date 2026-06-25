import { GDPSClient } from '$lib/api';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { resolve } from '$app/paths';

export const actions = {
	create_session: async ({ fetch, cookies, getClientAddress }) => {
		const token = cookies.get('token');
		const ip = getClientAddress();
		const client = new GDPSClient({ fetch, token, ip });

		try {
			await client.createSession();
			return { success: true, type: 'session' };
		} catch {
			return fail(400, {
				error: 'An unknown server error has happened, please try again!',
				type: 'session'
			});
		}
	},
	logout_all: async ({ fetch, cookies }) => {
		const token = cookies.get('token');
		const client = new GDPSClient({ fetch, token });

		try {
			await client.logout(true);
		} catch {
			return fail(400, {
				error: 'An unknown server error has happened, please try again!',
				type: 'logout_all'
			});
		}

		cookies.delete('token', {
			path: '/',
			maxAge: 2592000
		});
		return redirect(302, '/tools');
	},
	logout_device: async ({ request, fetch, cookies }) => {
		const formData = await request.formData();
		const key = formData.get('key');

		if (typeof key != 'string') {
			return fail(400, { error: 'Invalid device!', type: 'logout_device' });
		}

		const token = cookies.get('token');
		const client = new GDPSClient({ fetch, token });

		try {
			await client.removeDevice(key);
			return { success: true, type: 'logout_device' };
		} catch {
			return fail(400, {
				error: 'An unknown server error has happened, please try again!',
				type: 'logout_device'
			});
		}
	}
} satisfies Actions;

export const load: PageServerLoad = async ({ cookies, fetch }) => {
	const token = cookies.get('token');
	if (!token) {
		const url_params = new URLSearchParams({ redirect: '/account/management' });
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
