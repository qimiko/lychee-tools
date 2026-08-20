import { toIntSafe } from '$lib';
import { GDPSClient, type TopStatType } from '$lib/api';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, url }) => {
	const client = new GDPSClient({ fetch });

	const type = (url.searchParams.get('type') ?? 'stars') as TopStatType | undefined;
	const time = url.searchParams.get('time');
	const max_version = toIntSafe(url.searchParams.get('max_version')) ?? 19;

	const count = 250;

	let users;
	if (time == 'daily' && type != 'creator_points') {
		users = await client.getTopRecentUsers({ type, count, daily: true, max_version });
	} else if (time == 'weekly' && type != 'creator_points') {
		users = await client.getTopRecentUsers({ type, count, daily: false, max_version });
	} else {
		users = await client.getTopUsers({ type, count, max_version });
	}

	return { users, type, time, max_version };
};
