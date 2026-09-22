import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { resolve } from '$app/paths';

export const load: PageServerLoad = async ({ params }) => {
	if (params.path == 'download.php') {
		redirect(301, resolve('/download'));
	}

	const valid_level = /^[a-zA-Z0-9 -]{1,48}$/g;
	if (!valid_level.test(params.path)) {
		error(404);
	}

	const search = new URLSearchParams({ query: params.path });
	redirect(303, resolve('/levels') + `?${search}`);
};
