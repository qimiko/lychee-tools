import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
	PUBLIC_TURNSTILE_SITE_KEY: { public: true },
	PUBLIC_SITE_TESTING: { public: true, schema: (input) => input == 'true' },
	GDPS_BASE_URL: { schema: (input) => input ?? 'https://19gdps.com/gdapi' }
});
