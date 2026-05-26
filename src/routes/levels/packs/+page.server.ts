import { GDPSClient } from '$lib/api';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, cookies }) => {
	const token = cookies.get('token');

	const client = new GDPSClient({ token, fetch });
	const packs = await client.getAllMapPacks();

	return { packs };
};
