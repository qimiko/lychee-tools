import { resolve } from '$app/paths';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
	// prevent people from finding this page on accident and getting scared
	if (!cookies.get('delete_key')) {
		redirect(303, resolve('/tools'));
	}

	cookies.delete('delete_key', {
		path: '/',
		maxAge: 300
	});
};
