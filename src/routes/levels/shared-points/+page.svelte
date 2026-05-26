<script lang="ts">
	import type { PageData } from './$types.js';

	import Title from '$lib/components/core/Title.svelte';
	import Link from '$lib/components/core/Link.svelte';
	import { resolve } from '$app/paths';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
</script>

<svelte:head>
	<title>Shared Creator Points - 1.9 GDPS</title>
	<meta name="og:site_name" content="1.9 GDPS" />
	<meta name="og:title" content="Shared Creator Points" />
</svelte:head>

<Title>Shared Creator Points</Title>

<div class="table-container">
	<table>
		<thead>
			<tr>
				<th>Level ID</th>
				<th>Shared Users</th>
			</tr>
		</thead>
		<tbody>
			{#each data.shares as item (item.id)}
				<tr>
					<td>
						<Link href={resolve('/levels/[id]', { id: item.id.toString() })}>
							{item.id}
						</Link>
						({item.creator_name} -
						<Link href={resolve('/users/[id]', { id: item.creator_id.toString() })}>
							{item.creator_id}
						</Link>)
					</td>
					<td>
						{#each item.shares as share (share.id)}
							<span class="share-item">
								({share.name} -
								<Link href={resolve('/users/[id]', { id: share.id.toString() })}>
									{share.id}
								</Link>)
							</span>
						{/each}
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
	.table-container {
		width: 100%;
		overflow-x: scroll;
	}

	table {
		width: 100%;
		border: none;
		border-spacing: 0;
	}

	table thead {
		background-color: white;
	}

	th {
		border: none;
	}

	td {
		border: none;
	}

	tbody tr:nth-child(even) {
		background-color: #fafafa;
	}

	/* incredibly evil method of adding comma without joining */
	.share-item:not(:last-child)::after {
		content: ', ';
	}
</style>
