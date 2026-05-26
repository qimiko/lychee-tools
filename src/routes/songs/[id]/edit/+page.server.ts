import { GDPSClient } from '$lib/api';
import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { resolve } from '$app/paths';

export const actions = {
	default: async ({ request, fetch, cookies, getClientAddress, params }) => {
		const id = params.id;

		const formData = await request.formData();

		const name = formData.get('name');
		const artist = formData.get('artist');
		const download = formData.get('download');

		if (typeof name != 'string' || typeof artist != 'string' || typeof download != 'string') {
			return fail(400, { error: 'Invalid information.' });
		}

		const ip = getClientAddress();
		const token = cookies.get('token');
		const client = new GDPSClient({ fetch, token, ip });

		const song = await client.getSong(+id);

		try {
			// only send values that were changed, for better audit logs
			await client.editSong(
				song.id,
				song.title == name ? undefined : name,
				song.artist_name == artist ? undefined : artist,
				song.download == download ? undefined : download
			);
			return { success: true, name, artist, download };
		} catch {
			return fail(400, {
				error: 'An unknown server error has happened, please try again!',
				name,
				artist,
				download
			});
		}
	}
} satisfies Actions;

export const load: PageServerLoad = async ({ fetch, cookies, params }) => {
	const id = params.id;

	const token = cookies.get('token');
	if (!token) {
		const url_params = new URLSearchParams({ redirect: `/levels/songs/${id}/edit` });
		redirect(303, resolve('/account/login') + `?${url_params}`);
	}

	const client = new GDPSClient({ fetch });

	let song;
	try {
		song = await client.getSong(+id);
	} catch {
		error(404);
	}

	return { song };
};
