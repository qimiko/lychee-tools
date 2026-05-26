<script lang="ts">
	import type { PageData } from './$types.js';

	import Title from '$lib/components/core/Title.svelte';
	import Link from '$lib/components/core/Link.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import { resolve } from '$app/paths';
	import { goto } from '$app/navigation';
	import { formatTimestamp } from '$lib';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let page = $derived(data.params.page ?? 0);
	let count = $derived(data.params.count ?? 250);

	async function updateQueryParams() {
		const params = new URLSearchParams();
		params.set('page', page.toString());
		params.set('count', count.toString());

		await goto(`${resolve('/levels/sent')}?${params}`, {
			noScroll: true,
			keepFocus: true,
			replaceState: true
		});
	}
</script>

<svelte:head>
	<title>Suggest List - 1.9 GDPS</title>
	<meta name="og:site_name" content="1.9 GDPS" />
	<meta name="og:title" content="Suggest List" />
</svelte:head>

<Title>Suggest List</Title>

<div>
	<Pagination
		count={data.sends.count}
		pageCount={data.sends.items.length}
		perPage={data.params.count ?? 25}
		page={data.params.page ?? 0}
		pluralName="sends"
		singularName="send"
		onSelect={async (x) => {
			page = x;
			await updateQueryParams();
		}}
	/>
</div>

{#if data.sends.count == 0}
	<div>No songs were found!</div>
{:else}
	<div class="table-container">
		<table>
			<thead>
				<tr>
					<th>Time</th>
					<th>Suggested by</th>
					<th>Level ID</th>
					<th>Difficulty</th>
					<th>Stars</th>
					<th>Rating</th>
				</tr>
			</thead>
			<tbody>
				{#each data.sends.items as item (item.id)}
					{@const difficulty_name = (() => {
						if (item.demon) return 'Demon';
						else if (item.auto) return 'Auto';
						else
							switch (item.difficulty) {
								default:
									return 'Unknown';
								case 0:
									return 'N/A';
								case 1:
									return 'Easy';
								case 2:
									return 'Normal';
								case 3:
									return 'Hard';
								case 4:
									return 'Harder';
								case 5:
									return 'Insane';
							}
					})()}
					<tr>
						<td>{formatTimestamp(item.time)}</td>
						<td>
							<Link href={resolve('/users/[id]', { id: item.by_user_id.toString() })}>
								{item.by_username}
							</Link>
						</td>
						<td>
							<Link href={resolve('/levels/[id]', { id: item.level.toString() })}>
								{item.level}
							</Link>
						</td>
						<td>{difficulty_name}</td>
						<td>{item.stars}</td>
						<td>
							{#if item.rating == 0}
								None
							{:else if item.rating == 1}
								Feature
							{:else}
								Super
							{/if}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<div>
		<Pagination
			count={data.sends.count}
			pageCount={data.sends.items.length}
			perPage={data.params.count ?? 25}
			page={data.params.page ?? 0}
			pluralName="sends"
			singularName="send"
			onSelect={async (x) => {
				page = x;
				await updateQueryParams();
			}}
		/>
	</div>
{/if}

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
</style>
