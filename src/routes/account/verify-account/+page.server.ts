import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { GDPSClient, ServerError } from '$lib/api';
import { redirect } from '@sveltejs/kit';
import { resolve } from '$app/paths';

export const actions = {
	default: async ({ request, fetch, getClientAddress }) => {
		const formData = await request.formData();
		const key = formData.get('key');
		const captcha = formData.get('cf-turnstile-response');

		if (typeof key != 'string' || typeof captcha != 'string') {
			return fail(400, { error: 'Invalid information.', email: '' });
		}

		const client = new GDPSClient({
			fetch,
			ip: getClientAddress()
		});

		try {
			await client.finishVerification(key, captcha);

			return { success: true, key };
		} catch (e) {
			if (e instanceof ServerError) {
				if (e.type == 'invalid_request') {
					return fail(400, {
						error: 'Invalid data, make sure you entered everything correctly!',
						key
					});
				}
			}

			return fail(400, { error: 'An unknown server error has happened, please try again!' });
		}
	}
} satisfies Actions;

export const load: PageServerLoad = async ({ url }) => {
	if (!url.searchParams.get('k')) {
		return redirect(303, resolve('/tools'));
	}
};
