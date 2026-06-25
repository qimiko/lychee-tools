<script lang="ts">
	import type { PageData } from './$types.js';

	import Title from '$lib/components/core/Title.svelte';
	import Link from '$lib/components/core/Link.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import { resolve } from '$app/paths';
	import { goto } from '$app/navigation';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let page = $derived(data.params.page ?? 0);
	let count = $derived(data.params.count ?? 250);

	async function updateQueryParams() {
		// eslint-disable-next-line svelte/prefer-svelte-reactivity
		const params = new URLSearchParams();
		params.set('page', page.toString());
		params.set('count', count.toString());

		// eslint-disable-next-line svelte/no-navigation-without-resolve
		await goto(`${resolve('/levels/most-reported')}?${params}`, {
			noScroll: true,
			keepFocus: true,
			replaceState: true
		});
	}
</script>

<svelte:head>
	<title>Reported Levels - 1.9 GDPS</title>
	<meta name="og:site_name" content="1.9 GDPS" />
	<meta name="og:title" content="Reported Levels" />
</svelte:head>

<Title>Reported Levels</Title>

<div>
	<Pagination
		count={data.reports.count}
		pageCount={data.reports.items.length}
		perPage={data.params.count ?? 25}
		page={data.params.page ?? 0}
		pluralName="levels"
		singularName="level"
		onSelect={async (x) => {
			page = x;
			await updateQueryParams();
		}}
	/>
</div>

{#if data.reports.count == 0}
	<div>No levels were found!</div>
{:else}
	<table>
		<thead>
			<tr>
				<th>Level ID</th>
				<th>Reported</th>
			</tr>
		</thead>
		<tbody>
			{#each data.reports.items as item (`${item.level}`)}
				<tr>
					<td>
						<Link href={resolve('/levels/[id]', { id: item.level.toString() })}>
							{item.level}
						</Link>
					</td>
					<td>{item.reported} times</td>
				</tr>
			{/each}
		</tbody>
	</table>

	<div>
		<Pagination
			count={data.reports.count}
			pageCount={data.reports.items.length}
			perPage={data.params.count ?? 25}
			page={data.params.page ?? 0}
			pluralName="levels"
			singularName="level"
			onSelect={async (x) => {
				page = x;
				await updateQueryParams();
			}}
		/>
	</div>
{/if}
