import { GDPSClient } from '$lib/api';
import { error, redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { resolve } from '$app/paths';

export const load: LayoutServerLoad = async ({ fetch, params, cookies }) => {
	const token = cookies.get('token');

	const client = new GDPSClient({ token, fetch });

	const id = +params.id;
	if (!id) {
		const search_check = await client.searchUsers(params.id, 0, 1);
		if (search_check.count == 0) {
			return error(404);
		}

		const user_id = search_check.items[0].id.toString();
		redirect(
			307,
			resolve('/users/[id]', {
				id: user_id
			})
		);
	}

	let user;
	try {
		user = await client.getUser(id);
	} catch {
		error(404);
	}

	return { user };
};
