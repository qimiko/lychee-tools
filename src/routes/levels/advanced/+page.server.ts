import {
	GDPSClient,
	ServerError,
	type AdvancedSearchLevelData,
	type AdvancedLevelSortType,
	type LevelDifficulty,
	type LevelLength
} from '$lib/api';
import type { PageServerLoad } from './$types';
import { toIntSafe, toBooleanSafe, undefIfEmpty } from '$lib';
import { redirect } from '@sveltejs/kit';
import { resolve } from '$app/paths';

export const load: PageServerLoad = async ({ fetch, url, cookies }) => {
	const params: AdvancedSearchLevelData = {
		by_users: undefIfEmpty(
			url.searchParams.getAll('by_user').flatMap((u) => {
				const x = parseInt(u);
				if (x) return [x];
				else return [];
			})
		),
		by_accounts: undefIfEmpty(
			url.searchParams.getAll('by_account').flatMap((u) => {
				const x = parseInt(u);
				if (x) return [x];
				else return [];
			})
		),
		starts_with: url.searchParams.get('starts_with') ?? undefined,
		contains: url.searchParams.get('contains') ?? undefined,
		difficulties: undefIfEmpty(
			url.searchParams.getAll('difficulty').map((d) => d as LevelDifficulty)
		),
		lengths: undefIfEmpty(url.searchParams.getAll('length').map((l) => l as LevelLength)),
		ids_in: undefIfEmpty(
			url.searchParams.getAll('id_in').flatMap((u) => {
				const x = toIntSafe(u);
				if (x !== undefined) return [x];
				else return [];
			})
		),
		ids_not_in: undefIfEmpty(
			url.searchParams.getAll('id_not_in').flatMap((u) => {
				const x = toIntSafe(u);
				if (x !== undefined) return [x];
				else return [];
			})
		),
		rating_min: toIntSafe(url.searchParams.get('rating_min')),
		rating_max: toIntSafe(url.searchParams.get('rating_max')),
		stars_min: toIntSafe(url.searchParams.get('stars_min')),
		stars_max: toIntSafe(url.searchParams.get('stars_max')),
		object_count_min: toIntSafe(url.searchParams.get('object_count_min')),
		object_count_max: toIntSafe(url.searchParams.get('object_count_max')),
		original_id: toIntSafe(url.searchParams.get('original_id')),
		two_player: toBooleanSafe(url.searchParams.get('two_player')),
		game_version_min: toIntSafe(url.searchParams.get('game_version_min')),
		game_version_max: toIntSafe(url.searchParams.get('game_version_max')),
		audio_track: toIntSafe(url.searchParams.get('audio_track')),
		song_id: toIntSafe(url.searchParams.get('song_id')),
		custom_song: toBooleanSafe(url.searchParams.get('custom_song')),
		no_creator_points: toBooleanSafe(url.searchParams.get('no_creator_points')),
		reuploaded: toBooleanSafe(url.searchParams.get('reuploaded')),
		id_min: toIntSafe(url.searchParams.get('id_min')),
		id_max: toIntSafe(url.searchParams.get('id_max')),
		sent: toBooleanSafe(url.searchParams.get('sent')),
		reported: toBooleanSafe(url.searchParams.get('reported')),
		created_min: url.searchParams.get('created_min') ?? undefined,
		created_max: url.searchParams.get('created_max') ?? undefined,
		updated_min: url.searchParams.get('updated_min') ?? undefined,
		updated_max: url.searchParams.get('updated_max') ?? undefined,
		user_points_min: toIntSafe(url.searchParams.get('user_points_min')),
		user_points_max: toIntSafe(url.searchParams.get('user_points_max')),
		match_id: toIntSafe(url.searchParams.get('match_id')),
		unlisted: toBooleanSafe(url.searchParams.get('unlisted')),
		sort: (url.searchParams.get('sort') ?? 'downloads') as AdvancedLevelSortType | undefined,
		reverse_sort: toBooleanSafe(url.searchParams.get('reverse_sort')),
		page: toIntSafe(url.searchParams.get('page')) ?? 0,
		total: toIntSafe(url.searchParams.get('total')) ?? 25
	};

	const token = cookies.get('token');
	const client = new GDPSClient({ token, fetch });

	let levels;
	try {
		levels = await client.searchLevelsAdvanced(params);
	} catch (e) {
		// if the token is invalid, this is the one request that will mysteriously fail
		if (e instanceof ServerError) {
			if (e.type == 'invalid_credentials') {
				redirect(303, resolve('/account/logout'));
			}
		}

		throw e;
	}

	return { levels, params };
};
