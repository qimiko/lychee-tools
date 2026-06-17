import { GDPSClient, ServerError, type LevelSearchParams, type SearchLevelType } from '$lib/api';
import type { PageServerLoad } from './$types';
import { toIntSafe, onlyIfTrue, undefIfEmpty } from '$lib';
import { redirect } from '@sveltejs/kit';
import { resolve } from '$app/paths';

export const load: PageServerLoad = async ({ fetch, url, cookies }) => {
	const params: LevelSearchParams = {
		type: (url.searchParams.get('type') ?? 'most_downloaded') as SearchLevelType | undefined,
		page: toIntSafe(url.searchParams.get('page')) ?? 0,
		query: url.searchParams.get('query') ?? undefined,
		no_points: onlyIfTrue(url.searchParams.get('no_points')) ?? false,
		epic: onlyIfTrue(url.searchParams.get('epic')) ?? false,
		count: toIntSafe(url.searchParams.get('count')) ?? 25,
		diffs: undefIfEmpty(
			url.searchParams.getAll('diff').flatMap((u) => {
				const x = parseInt(u);
				if (x) return [x];
				else return [];
			})
		),
		lengths: undefIfEmpty(
			url.searchParams.getAll('length').flatMap((u) => {
				const x = toIntSafe(u);
				if (x !== undefined) return [x];
				else return [];
			})
		),
		star: onlyIfTrue(url.searchParams.get('star')) ?? false,
		no_stars: onlyIfTrue(url.searchParams.get('no_star')) ?? false,
		two_player: onlyIfTrue(url.searchParams.get('two_player')) ?? false,
		original: onlyIfTrue(url.searchParams.get('original')) ?? false,
		featured: onlyIfTrue(url.searchParams.get('featured')) ?? false,
		audio_track: toIntSafe(url.searchParams.get('audio_track')),
		custom_song: onlyIfTrue(url.searchParams.get('custom_song')) ?? false,
		no_reupload: onlyIfTrue(url.searchParams.get('no_reupload')) ?? false,
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
