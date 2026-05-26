import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { resolve } from '$app/paths';

const mappings: Record<string, string> = {
	'account/registerAccount.php': resolve('/account/register'),
	'account/activateAccount.php': resolve('/account/resend-activation'),
	'account/changePassword.php': resolve('/account/management/change-password'),
	'account/changeUsername.php': resolve('/account/management/change-username'),
	'account/enableLegacyAuth.php': resolve('/account/management/legacy-token'),
	'newSession.php': resolve('/account/management'),
	'account/resetPassword.php': resolve('/account/forgot-password'),
	'account/checkTokens.php': resolve('/account/management'),
	'stats/epicLevels.php': resolve('/levels') + '?type=super',
	'levelReupload.php': resolve('/levels/reupload'),
	'stats/myUnlistedLevels.php': resolve('/levels') + '?type=self_unlisted',
	'stats/mapPacks.php': resolve('/levels/packs'),
	'stats/reportedLevels.php': resolve('/levels/most-reported'),
	'stats/comments.php': resolve('/comments'),
	'stats/suggestList.php': resolve('/levels/sent'),
	'songAdd.php': resolve('/songs/reupload'),
	'mod/songEdit.php': resolve('/songs'),
	'stats/songsList.php': resolve('/songs'),
	'stats/getUserInfo.php': resolve('/users'),
	'stats/starGains.php': resolve('/users'),
	'stats/top24h.php': resolve('/leaderboards'),
	'stats/topWeek.php': resolve('/leaderboards'),
	'cron/cron.php': resolve('/tasks'),
	'cron/fixcps.php': resolve('/tasks'),
	'cron/autoban.php': resolve('/tasks'),
	'cron/deleteInvalidUsersAndSongs.php': resolve('/tasks'),
	'stats/serverInfo.php': resolve('/stats/server-info'),
	'stats/modActions.php': resolve('/actions'),
	'mod/leaderboardsBan.php': resolve('/users'),
	'mod/leaderboardsUnban.php': resolve('/users'),
	'mod/sendBan.php': resolve('/users'),
	'mod/packCreate.php': resolve('/levels/packs/create'),
	'mod/editPack.php': resolve('/levels/packs'),
	'mod/manageComments.php': resolve('/comments'),
	'mod/commentBan.php': resolve('/users'),
	'mod/sharedcp.php': resolve('/levels/shared-points'),
	'admin/mod.php': resolve('/users'),
	'super/admin.php': resolve('/users')
};

export const load: PageServerLoad = async ({ params }) => {
	const path = params.path;

	if (path in mappings) {
		redirect(301, mappings[path]);
	}

	error(404);
};
