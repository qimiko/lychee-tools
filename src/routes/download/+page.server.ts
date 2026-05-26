import { GDPSClient } from '$lib/api';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	const client = new GDPSClient({ fetch });
	const update = await client.getLatestUpdate();

	return { update };
};
