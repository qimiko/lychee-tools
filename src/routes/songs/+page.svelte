<script lang="ts">
	import type { PageData } from './$types.js';

	import Title from '$lib/components/core/Title.svelte';
	import Link from '$lib/components/core/Link.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import { resolve } from '$app/paths';
	import { goto } from '$app/navigation';
	import FormInput from '$lib/components/core/FormInput.svelte';
	import IconButton from '$lib/components/core/IconButton.svelte';
	import Search from '@lucide/svelte/icons/search';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let page = $derived(data.params.page ?? 0);
	let query = $derived(data.params.query ?? '');
	let no_reupload = $derived(!data.params.reupload);
	let count = $derived(data.params.count ?? 250);

	async function updateQueryParams() {
		// eslint-disable-next-line svelte/prefer-svelte-reactivity
		const params = new URLSearchParams();
		params.set('page', page.toString());
		params.set('count', count.toString());

		if (query) {
			params.set('query', query);
		}

		if (no_reupload) {
			params.set('no_reupload', 'true');
		}

		// eslint-disable-next-line svelte/no-navigation-without-resolve
		await goto(`${resolve('/songs')}?${params}`, {
			noScroll: true,
			keepFocus: true,
			replaceState: true
		});
	}

	async function onSearch(e: SubmitEvent) {
		page = 0;

		e.preventDefault();
		updateQueryParams();
	}
</script>

<svelte:head>
	<title>Song List - 1.9 GDPS</title>
	<meta name="og:site_name" content="1.9 GDPS" />
	<meta name="og:title" content="Song List" />
</svelte:head>

<Title>Song List</Title>

<form onsubmit={onSearch}>
	<div class="search-row">
		<FormInput placeholder="Song Name" type="text" bind:value={query} />
		<IconButton type="submit">
			<Search />
		</IconButton>
	</div>
</form>

<div>
	<Pagination
		count={data.songs.count}
		pageCount={data.songs.items.length}
		perPage={data.params.count ?? 50}
		page={data.params.page ?? 0}
		pluralName="songs"
		singularName="song"
		onSelect={async (x) => {
			page = x;
			await updateQueryParams();
		}}
	/>
</div>

{#if data.songs.count == 0}
	<div>No songs were found!</div>
{:else}
	<div class="table-container">
		<table>
			<thead>
				<tr>
					<th>ID</th>
					{#if data.current_user && data.current_user.permission_level >= 1}
						<th>Action</th>
					{/if}
					<th>Title</th>
					<th>Download</th>
				</tr>
			</thead>
			<tbody>
				{#each data.songs.items as item (item.id)}
					{@const hostname = (() => {
						try {
							return new URL(item.download).hostname;
						} catch {
							return null;
						}
					})()}
					<tr>
						<td>{item.id}</td>
						{#if data.current_user && data.current_user.permission_level >= 1}
							<td>
								<Link
									href={resolve('/songs/[id]/edit', {
										id: item.id.toString()
									})}
								>
									Edit
								</Link>
							</td>
						{/if}
						<td>{item.title}</td>
						<td>
							{#if hostname}
								<Link href={item.download}>{hostname}</Link>
							{:else}
								{item.download}
							{/if}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<div>
		<Pagination
			count={data.songs.count}
			pageCount={data.songs.items.length}
			perPage={data.params.count ?? 50}
			page={data.params.page ?? 0}
			pluralName="songs"
			singularName="song"
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
		scrollbar-gutter: stable;
	}

	.search-row {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5em;
	}
</style>
