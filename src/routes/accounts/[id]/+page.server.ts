import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { GDPSClient } from '$lib/api';
import { resolve } from '$app/paths';

export const load: PageServerLoad = async ({ fetch, params, getClientAddress }) => {
	const id = +params.id;
	if (!id) {
		return error(404);
	}

	const ip = getClientAddress();
	const client = new GDPSClient({ fetch, ip });

	const account = await client.getAccount(id);

	if (account.user) {
		redirect(
			303,
			resolve('/users/[id]', {
				id: account.user.id.toString()
			})
		);
	} else {
		redirect(
			303,
			resolve('/accounts/[id]/manage', {
				id: account.account_id.toString()
			})
		);
	}
};
