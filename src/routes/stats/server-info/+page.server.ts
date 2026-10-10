import { GDPSClient } from '#lib/api/index.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, getClientAddress }) => {
	const client = new GDPSClient({ fetch, ip: getClientAddress() });
	const stats = await client.actions.getFullStats();

	return { stats };
};
