import { toIntSafe } from '$lib';
import { GDPSClient } from '$lib/api';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, url }) => {
	const query = url.searchParams.get('query') ?? undefined;
	const page = toIntSafe(url.searchParams.get('page')) ?? 0;
	const count = toIntSafe(url.searchParams.get('count')) ?? 25;

	const client = new GDPSClient({ fetch });
	const users = await client.searchUsers(query, page, count);

	return {
		users,
		params: {
			query,
			page,
			count
		}
	};
};
