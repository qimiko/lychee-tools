import { GDPSClient, ServerError, type ServerReuploadFailedError } from '$lib/api';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { resolve } from '$app/paths';
import { toIntSafe } from '$lib';

export const actions = {
	default: async ({ request, fetch, cookies, getClientAddress }) => {
		const formData = await request.formData();

		const level = formData.get('level');
		const url = formData.get('url');

		if (typeof level != 'string' || typeof url != 'string') {
			return fail(400, { error: 'Invalid information.', level: '', url: '' });
		}

		const level_id = toIntSafe(level);
		if (!level_id) {
			return fail(400, { error: 'Invalid level ID.', level: '', url });
		}

		const ip = getClientAddress();
		const token = cookies.get('token');
		const client = new GDPSClient({ fetch, token, ip });

		try {
			const reuploaded_id = await client.reuploadLevel(level_id, url);

			return { success: true, level, url, reuploaded_id };
		} catch (e) {
			if (e instanceof ServerError) {
				if (e.type == 'invalid_credentials') {
					return fail(400, { error: 'Incorrect password!', level, url });
				}

				if (e.type == 'ratelimited') {
					return fail(400, { error: 'You are being ratelimited, try again later!', level, url });
				}

				if (e.type == 'reupload_failed') {
					const error = (e.data as ServerReuploadFailedError).error;
					let message = 'An error occurred during reupload.';
					switch (error) {
						case 'fetch_failed':
							message = 'Failed to fetch level, try again later.';
							break;
						case 'reupload_exists':
							message = 'Level being reuploaded already exists.';
							break;
						case 'invalid_data':
							message = 'Invalid level!';
							break;
						case 'level_too_recent':
							message = 'Level is too new to be reuploaded! (Either updated or released in 2.0+)';
							break;
					}

					return fail(400, { error: message, level, url });
				}
			}

			return fail(400, {
				error: 'An unknown server error has happened, please try again!',
				level,
				url
			});
		}
	}
} satisfies Actions;

export const load: PageServerLoad = async ({ cookies }) => {
	const token = cookies.get('token');
	if (!token) {
		const url_params = new URLSearchParams({ redirect: '/levels/reupload' });
		redirect(303, resolve('/account/login') + `?${url_params}`);
	}
};
