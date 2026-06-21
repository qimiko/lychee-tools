import { toIntSafe } from '$lib';
import { GDPSClient, type AccountsSearchParams } from '$lib/api';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, url }) => {
	const params: AccountsSearchParams = {
		query: url.searchParams.get('query') ?? undefined,
		page: toIntSafe(url.searchParams.get('page')) ?? 0,
		count: toIntSafe(url.searchParams.get('count')) ?? 250,
		sort: url.searchParams.get('sort') == 'registered' ? 'registered' : 'name'
	};

	const client = new GDPSClient({ fetch });
	const accounts = await client.searchAccounts(params);

	return { accounts, params };
};
