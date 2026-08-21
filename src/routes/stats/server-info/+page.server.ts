import { GDPSClient } from '$lib/api';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, getClientAddress }) => {
	const client = new GDPSClient({ fetch, ip: getClientAddress() });
	const stats = await client.getFullStats();

	return { stats };
};
