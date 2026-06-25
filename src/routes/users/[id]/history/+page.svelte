<script lang="ts">
	import type { PageData } from './$types.js';

	import { formatTimestamp } from '$lib';
	import Title from '$lib/components/core/Title.svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
</script>

<svelte:head>
	<title>Stats History for {data.user.name} - 1.9 GDPS</title>
	<meta name="og:site_name" content="1.9 GDPS" />
	<meta name="og:title" content={`Stats History for ${data.user.name}`} />
</svelte:head>

<Title size={2}>Stats History</Title>

{#if data.history.length == 0}
	<div>No stats have been recorded for this user!</div>
{:else}
	<div class="table-container">
		<table>
			<thead>
				<tr>
					<th>Time</th>
					<th>Stars</th>
					<th>Demons</th>
					<th>Coins</th>
					<th>Max Stars</th>
				</tr>
			</thead>
			<tbody>
				{#each data.history as item (item.id)}
					<tr
						class:warning={item.stars < 0 || item.max_stars < 0}
						class:suspicious={item.stars > 750 || item.max_stars > 750}
					>
						<td>{formatTimestamp(item.timestamp)}</td>
						<td>{item.stars}</td>
						<td>{item.demons}</td>
						<td>{item.coins}</td>
						<td>{item.max_stars}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{/if}

<style>
	.table-container {
		width: 100%;
		overflow-x: scroll;
	}

	.warning {
		background-color: #f0f000;
	}

	.suspicious {
		background-color: #f00000;
	}
</style>
