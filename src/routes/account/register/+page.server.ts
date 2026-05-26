import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { GDPSClient, ServerError, type ServerInvalidRegistrationError } from '$lib/api';

export const actions = {
	default: async ({ request, fetch, getClientAddress }) => {
		const formData = await request.formData();
		const userName = formData.get('userName');
		const password = formData.get('password');
		const email = formData.get('email');

		if (typeof userName != 'string' || typeof password != 'string' || typeof email != 'string') {
			return fail(400, { success: false, error: 'Invalid information.', userName: '', email: '' });
		}

		const client = new GDPSClient({
			fetch,
			ip: getClientAddress()
		});

		try {
			await client.registerAccount(userName, password, email);
		} catch (e) {
			if (e instanceof ServerError) {
				if (e.type == 'invalid_registration') {
					const error_code = (e.data as ServerInvalidRegistrationError).error_code;
					let message = 'Invalid data was entered.';
					switch (error_code) {
						case 'username_taken':
							message = 'That username is already taken!';
							break;
						case 'email_taken':
							message = 'That email is already in use!';
							break;
						case 'username_too_long':
							message = 'Invalid username, either too long or contains invalid characters.';
							break;
						case 'invalid_password':
							message =
								'Invalid password, must be at most 20 characters and not contain special characters.';
							break;
						case 'invalid_email':
							message = 'Invalid email!';
							break;
						case 'password_too_short':
							message = 'Password must be at least 6 characters.';
							break;
						case 'username_too_short':
							message = 'Username must be at least 3 characters.';
							break;
					}

					return fail(400, { success: false, error: message, userName, email });
				} else if (e.type == 'ratelimited') {
					return fail(400, {
						success: false,
						error: 'You are being ratelimited, try again later.',
						userName,
						email
					});
				}
			}

			return fail(400, {
				success: false,
				error: 'An unknown server error has occurred, please try again!',
				userName,
				email
			});
		}

		return { success: true };
	}
} satisfies Actions;
