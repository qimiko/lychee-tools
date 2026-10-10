import { GDPSClient } from '#lib/api/index.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, cookies }) => {
	const token = cookies.get('token');

	const client = new GDPSClient({ token, fetch });
	const packs = await client.mapPacks.getAll();

	return { packs };
};
