import { GDPSClient, ServerError, type CommentsSearchSort, type ServerSong } from '$lib/api';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { toIntSafe } from '$lib';
import { resolve } from '$app/paths';

export const load: PageServerLoad = async ({ fetch, params, cookies, url }) => {
	const comments_page = toIntSafe(url.searchParams.get('comments_page')) ?? 0;
	const comments_sort = (url.searchParams.get('comments_sort') ??
		'timestamp') as CommentsSearchSort;

	const token = cookies.get('token');

	const id = +params.id;
	if (!id) {
		return error(404);
	}

	const client = new GDPSClient({ token, fetch });

	let level;
	try {
		level = await client.getLevel(id);
	} catch (e) {
		if (e instanceof ServerError) {
			if (e.type == 'invalid_credentials') {
				redirect(303, resolve('/account/logout'));
			}
		}

		return error(404);
	}

	let song: ServerSong | undefined;
	const revision = level.revisions[0];
	if (revision.song_id) {
		try {
			song = await client.getSong(revision.song_id);
		} catch {
			// no song :(
		}
	}

	const comments = await client.searchComments({
		levels: [id],
		page: comments_page,
		sort: comments_sort
	});

	return { level, comments, song, comments_page, comments_sort };
};
