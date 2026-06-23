import { resolve } from '$app/paths';
import { toIntSafe, undefIfEmpty } from '$lib';
import { GDPSClient, type ActionsSearchParams, type ActionType } from '$lib/api';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, url, cookies }) => {
	const token = cookies.get('token');
	if (!token) {
		const url_params = new URLSearchParams({ redirect: resolve('/stats/actions') });
		redirect(303, resolve('/account/login') + `?${url_params}`);
	}

	const params: ActionsSearchParams = {
		types: undefIfEmpty(url.searchParams.getAll('type') as ActionType[]),
		page: toIntSafe(url.searchParams.get('page')) ?? 0,
		count: toIntSafe(url.searchParams.get('count')) ?? 250,

		on_id: toIntSafe(url.searchParams.get('on_id')),
		by_account: toIntSafe(url.searchParams.get('by_account')),
		by_user: toIntSafe(url.searchParams.get('by_user')),
		by_ip: url.searchParams.get('by_ip') ?? undefined
	};

	const client = new GDPSClient({ fetch, token });
	const actions = await client.searchActions(params);

	return { actions, params };
};
