import { GDPSClient } from '$lib/api';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	const client = new GDPSClient({ fetch });
	const shares = await client.getSharedPoints();

	return { shares };
};
