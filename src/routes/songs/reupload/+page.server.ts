import { GDPSClient, ServerError, type ServerReuploadFailedError } from '$lib/api';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { resolve } from '$app/paths';

export const actions = {
	default: async ({ request, fetch, cookies, getClientAddress }) => {
		const formData = await request.formData();

		const url = formData.get('url');
		const title = formData.get('title');
		const artist = formData.get('artist');

		if (typeof url != 'string' || typeof title != 'string' || typeof artist != 'string') {
			return fail(400, { error: 'Invalid information.' });
		}

		const ip = getClientAddress();
		const token = cookies.get('token');
		const client = new GDPSClient({ fetch, token, ip });

		const override_title = title ? title : undefined;
		const override_artist = artist ? artist : undefined;

		try {
			const reuploaded_id = await client.reuploadSong(url, override_title, override_artist);

			return { success: true, url, title, artist, reuploaded_id };
		} catch (e) {
			if (e instanceof ServerError) {
				if (e.type == 'invalid_credentials') {
					return fail(400, { error: 'Incorrect password!', url, title, artist });
				}

				if (e.type == 'ratelimited') {
					return fail(400, {
						error: 'You are being ratelimited, try again later!',
						url,
						title,
						artist
					});
				}

				if (e.type == 'reupload_failed') {
					const error = (e.data as ServerReuploadFailedError).error;
					let message = 'An error occurred during reupload.';
					switch (error) {
						case 'fetch_failed':
							message =
								'Failed to fetch song, please make sure your song is publicly accessible and is a valid audio file.';
							break;
						case 'reupload_exists':
							message = 'Song being reuploaded already exists.';
							break;
						case 'invalid_data':
							message = 'Invalid song!';
							break;
					}

					return fail(400, { error: message, url, title, artist });
				}
			}

			return fail(400, {
				error: 'An unknown server error has happened, please try again!',
				url,
				title,
				artist
			});
		}
	}
} satisfies Actions;

export const load: PageServerLoad = async ({ cookies }) => {
	const token = cookies.get('token');
	if (!token) {
		const url_params = new URLSearchParams({ redirect: '/songs/reupload' });
		redirect(303, resolve('/account/login') + `?${url_params}`);
	}
};
