import { resolve } from '$app/paths';
import { GDPSClient, ServerError } from '$lib/api';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, fetch, getClientAddress, cookies }) => {
	const key = url.searchParams.get('k');
	if (!key) {
		return redirect(303, resolve('/tools'));
	}

	const client = new GDPSClient({
		fetch,
		ip: getClientAddress()
	});

	try {
		await client.self.continueDeletion(key);
	} catch (e) {
		if (e instanceof ServerError) {
			if (e.type == 'invalid_request') {
				error(400, 'Invalid data, make sure you entered everything correctly!');
			}

			if (e.type == 'invalid_credentials') {
				redirect(303, resolve('/tools'));
			}
		}

		error(400, 'An unknown server error has happened, please try again!');
	}

	cookies.delete('token', {
		path: '/',
		maxAge: 2592000
	});
	cookies.set('delete_key', 'true', {
		path: '/',
		maxAge: 300,
		httpOnly: true
	});

	// use a separate page so that the cookies can update
	redirect(303, resolve('/account/deletion-finished'));
};
