import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { resolve } from '$app/paths';

const mappings: Record<string, string> = {
	youtube: 'https://www.youtube.com/channel/UCIUpOcn9GZ-IlEw34czouIg',
	twitter: 'https://twitter.com/official19gdps',
	discord: 'https://discord.gg/eCGFrCG',
	demonlist: 'https://demonlist.19gdps.com/',
	editor: resolve('/faq/editor-guide')
};

export const load: PageServerLoad = async ({ params }) => {
	const path = params.path;

	if (path in mappings) {
		redirect(301, mappings[path]);
	}

	redirect(301, resolve('/'));
};
