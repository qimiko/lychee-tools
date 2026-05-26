import { AuthenticationError, GDPSClient, ServerError } from '$lib/api/index.js';
import type { LayoutServerLoad } from './$types.js';

export const load: LayoutServerLoad = async ({ cookies, fetch }) => {
	const token = cookies.get('token');
	if (token) {
		try {
			const client = new GDPSClient({ token, fetch });
			const profile = await client.getAccount();

			return { current_user: profile };
		} catch (e) {
			if (e instanceof ServerError || e instanceof AuthenticationError) {
				// we need to redo the token fetch, but we can't due to the promise
				// cookies.delete("token", { path: "/" });
			}
		}
	}

	return { current_user: null };
};
