import { GDPSClient, ServerError, type LevelSearchParams, type SearchLevelType } from '$lib/api';
import type { PageServerLoad } from './$types';
import { toIntSafe, onlyIfTrue } from '$lib';
import { redirect } from '@sveltejs/kit';
import { resolve } from '$app/paths';

export const load: PageServerLoad = async ({ fetch, url, cookies }) => {
	const params: LevelSearchParams = {
		type: (url.searchParams.get('type') ?? 'most_downloaded') as SearchLevelType | undefined,
		count: toIntSafe(url.searchParams.get('count')) ?? 25,
		page: toIntSafe(url.searchParams.get('page')) ?? 0,
		query: url.searchParams.get('query') ?? undefined,
		epic: onlyIfTrue(url.searchParams.get('epic')),
		star: onlyIfTrue(url.searchParams.get('star')),
		no_points: onlyIfTrue(url.searchParams.get('no_points')),
		no_reupload: onlyIfTrue(url.searchParams.get('no_reupload'))
	};

	const token = cookies.get('token');
	const client = new GDPSClient({ token, fetch });

	let levels;
	try {
		levels = await client.searchLevels(params);
	} catch (e) {
		// if the token is invalid, this is the one request that will mysteriously fail
		if (e instanceof ServerError) {
			if (e.type == 'invalid_credentials') {
				redirect(303, resolve('/account/login'));
			}
		}

		throw e;
	}

	return { levels, params };
};
