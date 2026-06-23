import { resolve } from '$app/paths';
import { GDPSClient } from '$lib/api';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, cookies }) => {
	const token = cookies.get('token');
	if (!token) {
		const url_params = new URLSearchParams({ redirect: resolve('/stats/actions') });
		redirect(303, resolve('/account/login') + `?${url_params}`);
	}

	const client = new GDPSClient({ fetch, token });

	const top_actions = await client.getTopActions();

	return { top_actions };
};
