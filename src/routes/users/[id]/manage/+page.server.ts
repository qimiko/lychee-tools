import { GDPSClient, type BanType } from '$lib/api';
import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { resolve } from '$app/paths';

export const actions = {
	add_ban: async ({ request, fetch, cookies, params, getClientAddress }) => {
		const id = +params.id;

		const formData = await request.formData();
		const type = formData.get('type');
		const reason = formData.get('reason');

		if (typeof type != 'string' || typeof reason != 'string' || !id) {
			return fail(400, { error: 'Invalid ban!', type: 'add_ban' });
		}

		const token = cookies.get('token');
		const ip = getClientAddress();
		const client = new GDPSClient({ fetch, token, ip });

		try {
			await client.createBan(id, type as BanType, reason);
			return { success: true, type: 'add_ban' };
		} catch {
			return fail(400, {
				error: 'An unknown server error has happened, please try again!',
				type: 'add_ban'
			});
		}
	},
	remove_ban: async ({ request, fetch, cookies, params, getClientAddress }) => {
		const id = +params.id;

		const formData = await request.formData();
		const key = formData.get('key');

		if (typeof key != 'string' || !id) {
			return fail(400, { error: 'Invalid ban type!', type: 'remove_ban' });
		}

		const ip = getClientAddress();
		const token = cookies.get('token');
		const client = new GDPSClient({ fetch, token, ip });

		try {
			await client.removeBan(id, key as BanType);
			return { success: true, type: 'remove_ban' };
		} catch {
			return fail(400, {
				error: 'An unknown server error has happened, please try again!',
				type: 'remove_ban'
			});
		}
	}
} satisfies Actions;

export const load: PageServerLoad = async ({ fetch, params, cookies }) => {
	const id = +params.id;
	if (!id) {
		return error(404);
	}

	const token = cookies.get('token');
	if (!token) {
		const url_params = new URLSearchParams({ redirect: `/users/${id}/manage` });
		return redirect(303, resolve('/account/login') + `?${url_params}`);
	}

	const client = new GDPSClient({ token, fetch });

	const bans = await client.getUserBans(id);

	return { bans };
};
