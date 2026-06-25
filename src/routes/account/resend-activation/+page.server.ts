import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { GDPSClient, ServerError } from '$lib/api';

export const actions = {
	default: async ({ request, fetch, getClientAddress }) => {
		const formData = await request.formData();
		const email = formData.get('email');
		const captcha = formData.get('cf-turnstile-response');

		if (typeof email != 'string' || typeof captcha != 'string') {
			return fail(400, { error: 'Invalid information.', email: '' });
		}

		const client = new GDPSClient({
			fetch,
			ip: getClientAddress()
		});

		try {
			await client.beginPasswordReset(email, captcha, true);

			return { success: true, email };
		} catch (e) {
			if (e instanceof ServerError) {
				if (e.type == 'ratelimited') {
					return fail(400, {
						error: 'Please wait before requesting another activation email!',
						email
					});
				} else if (e.type == 'invalid_request') {
					return fail(400, {
						error: 'Invalid data, make sure you entered everything correctly!',
						email
					});
				} else if (e.type == 'invalid_email') {
					return fail(400, {
						error: 'Failed to send activation email. Please try again later.',
						email
					});
				}
			}

			return fail(400, { error: 'An unknown server error has happened, please try again!' });
		}
	}
} satisfies Actions;
