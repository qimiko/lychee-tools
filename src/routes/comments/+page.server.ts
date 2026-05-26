import { onlyIfTrue, toIntSafe, undefIfEmpty } from '$lib';
import { GDPSClient, type CommentsSearchParams, type CommentsSearchSort } from '$lib/api';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const actions = {
	bulk_delete: async ({ request, fetch, cookies, getClientAddress }) => {
		const formData = await request.formData();

		const ids = formData.getAll('comment');
		const comments = ids.filter((i) => typeof i == 'string').map((i) => +i);

		if (comments.length == 0) {
			return fail(400, { error: 'No comments selected.' });
		}

		const token = cookies.get('token');
		const ip = getClientAddress();
		const client = new GDPSClient({ fetch, token, ip });

		try {
			await client.manageComments(comments, 'delete');
			return { success: true };
		} catch {
			return fail(400, { error: 'An unknown server error has happened, please try again!' });
		}
	},
	bulk_hide: async ({ request, fetch, cookies, getClientAddress }) => {
		const formData = await request.formData();

		const ids = formData.getAll('comment');
		const comments = ids.filter((i) => typeof i == 'string').map((i) => +i);

		if (comments.length == 0) {
			return fail(400, { error: 'No comments selected.' });
		}

		const token = cookies.get('token');
		const ip = getClientAddress();
		const client = new GDPSClient({ fetch, token, ip });

		try {
			await client.manageComments(comments, 'hide');
			return { success: true };
		} catch {
			return fail(400, { error: 'An unknown server error has happened, please try again!' });
		}
	}
} satisfies Actions;

export const load: PageServerLoad = async ({ fetch, cookies, url }) => {
	const params: CommentsSearchParams = {
		page: toIntSafe(url.searchParams.get('page')) ?? 0,
		count: toIntSafe(url.searchParams.get('count')) ?? 50,

		users: undefIfEmpty(
			url.searchParams.getAll('user').flatMap((u) => {
				const x = parseInt(u);
				if (x) return [x];
				else return [];
			})
		),
		exclude_users: undefIfEmpty(
			url.searchParams.getAll('exclude_user').flatMap((u) => {
				const x = parseInt(u);
				if (x) return [x];
				else return [];
			})
		),

		levels: undefIfEmpty(
			url.searchParams.getAll('level').flatMap((l) => {
				const x = parseInt(l);
				if (x) return [x];
				else return [];
			})
		),

		includes: undefIfEmpty(url.searchParams.getAll('include')),
		excludes: undefIfEmpty(url.searchParams.getAll('exclude')),

		reverse: onlyIfTrue(url.searchParams.get('reverse')),
		sort: (url.searchParams.get('sort') ?? 'timestamp') as CommentsSearchSort
	};

	const token = cookies.get('token');
	const client = new GDPSClient({ token, fetch });

	const comments = await client.searchComments(params);

	return { comments, params };
};
