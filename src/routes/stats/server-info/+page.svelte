<script lang="ts">
	import type { PageData } from './$types.js';

	import Title from '$lib/components/core/Title.svelte';
	import type { ServerStatsLevelRow } from '$lib/api/index.js';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
</script>

<svelte:head>
	<title>Server Info - 1.9 GDPS</title>
	<meta name="og:site_name" content="1.9 GDPS" />
	<meta name="og:title" content="Server Info" />
</svelte:head>

{#snippet level_row(level: ServerStatsLevelRow)}
	<td>{level.total}</td>
	<td>{level.unrated}</td>
	<td>{level.rated}</td>
	<td>{level.featured}</td>
	<td>{level.epic}</td>
{/snippet}

<Title>Server Info</Title>

<Title size={2}>Levels</Title>

<table>
	<thead>
		<tr>
			<th>Difficulty</th>
			<th>Total</th>
			<th>Unrated</th>
			<th>Rated</th>
			<th>Featured</th>
			<th>Epic</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>Total</td>
			{@render level_row(data.stats.level.total)}
		</tr>
		<tr>
			<td>N/A</td>
			{@render level_row(data.stats.level.na)}
		</tr>
		<tr>
			<td>Auto</td>
			{@render level_row(data.stats.level.auto)}
		</tr>
		<tr>
			<td>Easy</td>
			{@render level_row(data.stats.level.easy)}
		</tr>
		<tr>
			<td>Normal</td>
			{@render level_row(data.stats.level.normal)}
		</tr>
		<tr>
			<td>Hard</td>
			{@render level_row(data.stats.level.hard)}
		</tr>
		<tr>
			<td>Harder</td>
			{@render level_row(data.stats.level.harder)}
		</tr>
		<tr>
			<td>Insane</td>
			{@render level_row(data.stats.level.insane)}
		</tr>
		<tr>
			<td>Demon</td>
			{@render level_row(data.stats.level.demon)}
		</tr>
	</tbody>
</table>

<Title size={2}>Accounts</Title>

<table>
	<thead>
		<tr>
			<th>Type</th>
			<th>Count</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>Total</td>
			<td>{data.stats.account.users}</td>
		</tr>
		<tr>
			<td>Registered</td>
			<td>{data.stats.account.registered}</td>
		</tr>
		<tr>
			<td>Total Actions</td>
			<td>{data.stats.account.total_actions}</td>
		</tr>
		<tr>
			<td>Active this Month</td>
			<td>{data.stats.account.active_this_month}</td>
		</tr>
		<tr>
			<td>Active this Week</td>
			<td>{data.stats.account.active_this_week}</td>
		</tr>
	</tbody>
</table>

<Title size={2}>Comments</Title>

<table>
	<thead>
		<tr>
			<th>From</th>
			<th>Count</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>Everyone</td>
			<td>{data.stats.comment.everyone}</td>
		</tr>
		<tr>
			<td>Moderators</td>
			<td>{data.stats.comment.moderators}</td>
		</tr>
	</tbody>
</table>

<Title size={2}>Leaderboards</Title>

<table>
	<thead>
		<tr>
			<th>Stat</th>
			<th>Count</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>Total</td>
			<td>{data.stats.leaderboard.unbanned}</td>
		</tr>
		<tr>
			<td>Banned</td>
			<td>{data.stats.leaderboard.banned}</td>
		</tr>
		<tr>
			<td>Stars Collected</td>
			<td>{data.stats.leaderboard.stars_collected}</td>
		</tr>
		<tr>
			<td>Coins Collected</td>
			<td>{data.stats.leaderboard.coins_collected}</td>
		</tr>
		<tr>
			<td>Demons Completed</td>
			<td>{data.stats.leaderboard.demons_completed}</td>
		</tr>
		<tr>
			<td>Creator Points Rewarded</td>
			<td>{data.stats.leaderboard.points_rewarded}</td>
		</tr>
	</tbody>
</table>
