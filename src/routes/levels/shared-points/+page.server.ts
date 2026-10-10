import { GDPSClient } from '#lib/api/index.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	const client = new GDPSClient({ fetch });
	const shares = await client.levels.getSharedPoints();

	return { shares };
};
