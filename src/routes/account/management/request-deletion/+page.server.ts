import { GDPSClient, ServerError } from '$lib/api';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { resolve } from '$app/paths';

export const actions = {
	default: async ({ request, fetch, cookies, getClientAddress }) => {
		const formData = await request.formData();

		const password = formData.get('password');

		if (typeof password != 'string') {
			return fail(400, { error: 'Invalid information.', username: '' });
		}

		const ip = getClientAddress();
		const token = cookies.get('token');
		const client = new GDPSClient({ fetch, token, ip });

		try {
			await client.self.requestDeletion(password);

			return { success: true };
		} catch (e) {
			if (e instanceof ServerError) {
				if (e.type == 'invalid_credentials') {
					return fail(400, { error: 'Incorrect password!' });
				}

				if (e.type == 'ratelimited') {
					return fail(400, { error: 'You are being ratelimited, try again later!' });
				}

				if (e.type == 'unauthorized') {
					return fail(400, {
						error: 'Moderators cannot delete their account, you must be demoted first...'
					});
				}
			}

			return fail(400, { error: 'An unknown server error has happened, please try again!' });
		}
	}
} satisfies Actions;

export const load: PageServerLoad = async ({ cookies, getClientAddress, parent }) => {
	const current_user = (await parent()).current_user;
	if (!current_user) {
		const url_params = new URLSearchParams({ redirect: '/account/management/request-deletion' });
		redirect(303, resolve('/account/login') + `?${url_params}`);
	}

	const token = cookies.get('token');

	const ip = getClientAddress();
	const client = new GDPSClient({ token, fetch, ip });

	let levels_count = 0;
	let comments_count = 0;
	try {
		const user_id = current_user.user?.id;
		if (user_id) {
			levels_count = (await client.levels.searchAdvanced({ by_users: [user_id], total: 1 })).count;
			comments_count = (await client.comments.search({ users: [user_id], count: 1 })).count;
		}
	} catch {
		const url_params = new URLSearchParams({ redirect: '/account/management/request-deletion' });
		redirect(303, resolve('/account/login') + `?${url_params}`);
	}

	return { levels_count, comments_count };
};
