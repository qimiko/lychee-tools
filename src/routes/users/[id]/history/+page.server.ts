import { GDPSClient } from '$lib/api';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, params, cookies }) => {
	const token = cookies.get('token');

	const id = +params.id;
	if (!id) {
		return error(404);
	}

	const client = new GDPSClient({ token, fetch });

	const history = await client.getStatsHistory(id);

	return { history };
};
