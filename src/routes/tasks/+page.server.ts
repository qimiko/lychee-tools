import { GDPSClient, ServerError } from '$lib/api';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const actions = {
	default: async ({ request, fetch, cookies, getClientAddress }) => {
		const formData = await request.formData();
		const action = formData.get('action');

		if (typeof action != 'string') {
			return fail(400, { error: 'Invalid action!' });
		}

		const token = cookies.get('token');
		const ip = getClientAddress();
		const client = new GDPSClient({ fetch, token, ip });

		try {
			await client.runTask(action);
			return { success: true };
		} catch (e) {
			if (e instanceof ServerError) {
				if (e.type == 'unauthorized') {
					return fail(400, { error: 'You are not allowed to perform this action!' });
				}
			}

			return fail(400, { error: 'An unknown server error has happened, please try again!' });
		}
	}
} satisfies Actions;

export const load: PageServerLoad = async ({ fetch, cookies }) => {
	const token = cookies.get('token');

	const client = new GDPSClient({ token, fetch });

	const tasks = await client.getTasks();

	return { tasks };
};
