import { GDPSClient } from '$lib/api';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	const client = new GDPSClient({ fetch });
	const stats = await client.getFullStats();

	return { stats };
};
