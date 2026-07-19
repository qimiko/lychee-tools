import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

interface ServerInfo {
	version: 1;
	motd?: string;
}

export const GET: RequestHandler = async () => {
	return json({
		version: 1,
		motd: 'This is the <cr>incorrect URL</c>, please add <cc>/gdapi</c> to access the 1.9 GDPS.'
	} satisfies ServerInfo);
};
