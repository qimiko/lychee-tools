import { toIntSafe } from '$lib';
import { GDPSClient } from '$lib/api';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, url }) => {
	const page = toIntSafe(url.searchParams.get('page')) ?? 0;
	const count = toIntSafe(url.searchParams.get('count')) ?? 50;

	const client = new GDPSClient({ fetch });
	const sends = await client.getSends(page, count);

	return { sends, params: { page, count } };
};
