import { GDPSClient } from '$lib/api';
import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { resolve } from '$app/paths';
import { toIntSafe } from '$lib';

export const actions = {
	default: async ({ request, fetch, cookies, getClientAddress, params }) => {
		const id = params.id;

		const formData = await request.formData();

		const name = formData.get('name');
		const levels = formData.get('levels');
		const stars = formData.get('stars');
		const coins = formData.get('coins');
		const difficulty = formData.get('difficulty');
		const color = formData.get('color');

		if (
			typeof name != 'string' ||
			typeof levels != 'string' ||
			typeof stars != 'string' ||
			typeof coins != 'string' ||
			typeof difficulty != 'string' ||
			typeof color != 'string'
		) {
			return fail(400, { error: 'Invalid information.' });
		}

		const level_list = levels.split(',').flatMap((l) => (+l ? [+l] : []));
		if (level_list.length == 0) {
			return fail(400, {
				error: 'No levels provided!',
				name,
				levels,
				stars,
				coins,
				difficulty,
				color
			});
		}

		const color_int = parseInt(color.substring(1), 16);

		const stars_int = toIntSafe(stars);
		const difficulty_int = toIntSafe(difficulty);
		const coins_int = toIntSafe(coins);

		if (stars_int === undefined || difficulty_int === undefined || coins_int === undefined) {
			return fail(400, { error: 'Invalid values.', name, levels, stars, coins, difficulty, color });
		}

		const ip = getClientAddress();
		const token = cookies.get('token');
		const client = new GDPSClient({ fetch, token, ip });

		const pack = (await client.getAllMapPacks()).items.find((m) => m.id.toString() == id);

		if (!pack) {
			return fail(404, { error: 'Pack does not exist.' });
		}

		try {
			// only send values that were changed, for better audit logs
			await client.editMapPack(
				pack.id,
				pack.name == name ? undefined : name,
				JSON.stringify(pack.levels) == JSON.stringify(level_list) ? undefined : level_list,
				pack.stars == stars_int ? undefined : stars_int,
				pack.coins == coins_int ? undefined : coins_int,
				pack.difficulty == difficulty_int ? undefined : difficulty_int,
				pack.text_color == color_int ? undefined : color_int,
				pack.bar_color == color_int ? undefined : color_int
			);
			return { success: true, name, levels, stars, coins, difficulty, color };
		} catch {
			return fail(400, {
				error: 'An unknown server error has happened, please try again!',
				name,
				levels,
				stars,
				coins,
				difficulty,
				color
			});
		}
	}
} satisfies Actions;

export const load: PageServerLoad = async ({ fetch, cookies, params }) => {
	const id = params.id;

	const token = cookies.get('token');
	if (!token) {
		const url_params = new URLSearchParams({ redirect: `/levels/packs/${id}/edit` });
		redirect(303, resolve('/account/login') + `?${url_params}`);
	}

	const client = new GDPSClient({ fetch });
	const pack = (await client.getAllMapPacks()).items.find((m) => m.id.toString() == id);

	if (!pack) {
		return error(404);
	}

	return { pack };
};
