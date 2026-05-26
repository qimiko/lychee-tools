import { GDPSClient, ServerError, type CommentsSearchSort } from '$lib/api';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { toIntSafe } from '$lib';
import { resolve } from '$app/paths';

export const load: PageServerLoad = async ({ fetch, params, cookies, url }) => {
	const comments_page = toIntSafe(url.searchParams.get('comments_page')) ?? 0;
	const comments_sort = (url.searchParams.get('comments_sort') ??
		'timestamp') as CommentsSearchSort;

	const token = cookies.get('token');

	const client = new GDPSClient({ token, fetch });

	const id = +params.id;
	if (!id) {
		return error(404);
	}

	let levels;
	try {
		levels = await client.searchLevels({
			type: 'user_levels',
			query: id.toString(),
			count: 5
		});
	} catch (e) {
		if (e instanceof ServerError) {
			if (e.type == 'invalid_credentials') {
				redirect(303, resolve('/account/login'));
			}
		}

		levels = { count: 0, items: [] };
	}

	const comments = await client.searchComments({
		users: [id],
		page: comments_page,
		sort: comments_sort
	});

	return { levels, comments, comments_page, comments_sort };
};
