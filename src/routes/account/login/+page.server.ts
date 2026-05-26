import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { GDPSClient, ServerError } from '$lib/api';

function getRedirectUrl(url: URL): string {
	let redirectUrl = url.searchParams.get('redirect');
	if (!redirectUrl || !redirectUrl.startsWith('/')) {
		redirectUrl = '/tools';
	}

	return redirectUrl;
}

export const actions = {
	default: async ({ request, url, cookies, fetch, getClientAddress }) => {
		const redirectUrl = getRedirectUrl(url);

		const formData = await request.formData();
		const userName = formData.get('userName');
		const password = formData.get('password');

		if (!userName || typeof userName != 'string' || !password || typeof password != 'string') {
			return fail(400, { error: 'Invalid information.', userName: '' });
		}

		const ip = getClientAddress();
		const client = new GDPSClient({ fetch, ip });

		try {
			const authkey = await client.loginAccount(userName, password);

			cookies.set('token', authkey, {
				path: '/',
				maxAge: 2592000,
				httpOnly: true
			});
		} catch (e) {
			if (e instanceof ServerError) {
				if (e.type == 'ratelimited') {
					return fail(400, { error: 'You are being ratelimited, try again later!', userName });
				}

				if (e.type == 'activation_required') {
					return fail(400, {
						error: 'Account activation required. Check your email for more details.',
						userName
					});
				}

				return fail(400, { error: 'Incorrect login!', userName });
			}

			return fail(400, {
				error: 'An unknown server error has occurred, please try again later.',
				userName
			});
		}

		return redirect(303, redirectUrl);
	}
} satisfies Actions;

export const load: PageServerLoad = async ({ url, parent }) => {
	// if the token is invalid, let them try to login again
	const auth_data = await parent();
	if (auth_data.current_user) {
		const redirectUrl = getRedirectUrl(url);
		redirect(303, redirectUrl);
	}
};
