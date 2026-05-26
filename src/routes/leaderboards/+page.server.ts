import { GDPSClient, type TopStatType } from '$lib/api';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, url }) => {
	const client = new GDPSClient({ fetch });

	const type = (url.searchParams.get('type') ?? 'stars') as TopStatType | undefined;
	const time = url.searchParams.get('time');

	const count = 250;

	let users;
	if (time == 'daily' && type != 'creator_points') {
		users = await client.getTopRecentUsers(type, count, true);
	} else if (time == 'weekly' && type != 'creator_points') {
		users = await client.getTopRecentUsers(type, count, false);
	} else {
		users = await client.getTopUsers(type, count);
	}

	return { users, type, time };
};
