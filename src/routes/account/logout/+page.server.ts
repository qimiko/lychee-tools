import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { GDPSClient } from '$lib/api';

export const load: PageServerLoad = async ({ cookies, fetch }) => {
	const token = cookies.get('token');
	if (!token) {
		return redirect(303, '/tools?logout=true');
	}

	const client = new GDPSClient({ fetch, token });

	cookies.delete('token', {
		path: '/',
		maxAge: 2592000
	});

	try {
		await client.logout();
	} catch {
		return error(500, 'An unknown server error has happened, please try again!');
	}

	return redirect(303, '/tools?logout=true');
};
