import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { resolve } from '$app/paths';

export const load: PageServerLoad = async ({ params }) => {
	if (params.path == 'download.php') {
		redirect(301, resolve('/download'));
	}

	const search = new URLSearchParams({ query: params.path });
	redirect(303, resolve('/levels') + `?${search}`);
};
