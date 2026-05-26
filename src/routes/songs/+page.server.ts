import { onlyIfTrue, toIntSafe } from '$lib';
import { GDPSClient, type SongsSearchParams } from '$lib/api';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, url }) => {
	const params: SongsSearchParams = {
		query: url.searchParams.get('query') ?? undefined,
		page: toIntSafe(url.searchParams.get('page')) ?? 0,
		count: toIntSafe(url.searchParams.get('count')) ?? 250,
		reupload: !(onlyIfTrue(url.searchParams.get('no_reupload')) ?? false)
	};

	const client = new GDPSClient({ fetch });
	const songs = await client.searchSongs(params);

	return { songs, params };
};
