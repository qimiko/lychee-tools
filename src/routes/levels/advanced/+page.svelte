<script lang="ts">
	import LevelCell from '$lib/components/cells/LevelCell.svelte';
	import Title from '$lib/components/core/Title.svelte';
	import type { PageData } from './$types.js';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import Pagination from '$lib/components/Pagination.svelte';
	import FormInput from '$lib/components/core/FormInput.svelte';
	import IconButton from '$lib/components/core/IconButton.svelte';
	import Search from '@lucide/svelte/icons/search';
	import Funnel from '@lucide/svelte/icons/funnel';
	import FunnelX from '@lucide/svelte/icons/funnel-x';

	import Button from '$lib/components/core/Button.svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let selected_page = $derived(data.params.page ?? 0);
	let total = $derived(data.params.total ?? 0);
	let sort = $derived(data.params.sort ?? 'uploaded');
	let reverse_sort = $derived(data.params.reverse_sort ?? false);

	let starts_with = $derived(data.params.starts_with ?? '');
	let contains = $derived(data.params.contains ?? '');

	async function updateQueryParams() {
		// eslint-disable-next-line svelte/prefer-svelte-reactivity
		const params = new URLSearchParams();
		params.set('page', selected_page.toString());
		params.set('count', total.toString());
		params.set('sort', sort);

		params.set('reverse_sort', reverse_sort ? 'true' : 'false');

		if (starts_with) {
			params.set('starts_with', starts_with);
		}

		if (contains) {
			params.set('contains', contains);
		}

		// eslint-disable-next-line svelte/no-navigation-without-resolve
		await goto(`${resolve('/levels/advanced')}?${params}`, {
			noScroll: true,
			keepFocus: true,
			replaceState: true
		});
	}

	async function onSearch(e?: Event) {
		selected_page = 0;

		e?.preventDefault();
		updateQueryParams();
	}

	let filters_open = $state(false);

	function resetFilters() {
		starts_with = '';
		contains = '';

		onSearch();
	}
</script>

<svelte:head>
	<title>Search Levels - 1.9 GDPS</title>
	<meta name="og:site_name" content="1.9 GDPS" />
	<meta name="og:title" content="Search Levels" />
</svelte:head>

<Title>Search Levels (Advanced)</Title>

<form onsubmit={onSearch}>
	<div class="search-row">
		<FormInput placeholder="Name Contains" type="text" bind:value={contains} />
		<IconButton type="submit">
			<Search />
		</IconButton>

		<IconButton onclick={() => (filters_open = !filters_open)} class={{ active: filters_open }}>
			<Funnel />
		</IconButton>
	</div>
</form>

<div class="sort-row">
	Sort by:
	<select bind:value={sort} onchange={onSearch}>
		<option value="uploaded">Last Uploaded</option>
		<option value="updated">Last Updated</option>
		<option value="downloads">Downloads</option>
		<option value="likes">Likes</option>
		<option value="rated">Rated</option>
		<option value="reported">Last Reported</option>
		<option value="sent">Last Sent</option>
		<option value="random">Random</option>
		<option value="by_list">By Provided IDs</option>
	</select>

	<label>
		Reverse?
		<input type="checkbox" bind:checked={reverse_sort} onchange={() => onSearch()} />
	</label>
</div>

{#if filters_open}
	<div class="advanced-filters">
		<span class="filters-header">Additional Filters</span>

		<FormInput placeholder="Name Starts With" type="text" bind:value={starts_with} />

		More filters coming soon!

		<Button icon={FunnelX} onclick={resetFilters}>Clear Filters</Button>
	</div>
{/if}

<Pagination
	count={data.levels.count}
	pageCount={data.levels.items.length}
	perPage={data.params.total ?? 25}
	page={data.params.page ?? 0}
	pluralName="levels"
	singularName="level"
	onSelect={async (x) => {
		selected_page = x;
		await updateQueryParams();
	}}
/>

{#if data.levels.count > 0}
	<div class="center">
		<div class="level-row">
			{#each data.levels.items as level (level.id)}
				<LevelCell {level} />
			{/each}
		</div>
	</div>

	<Pagination
		count={data.levels.count}
		pageCount={data.levels.items.length}
		perPage={data.params.total ?? 25}
		page={data.params.page ?? 0}
		pluralName="levels"
		singularName="level"
		onSelect={async (x) => {
			selected_page = x;
			await updateQueryParams();
		}}
	/>
{:else}
	<p>No levels found!</p>
{/if}

<style>
	.level-row {
		display: flex;
		flex-direction: column;

		row-gap: 1em;
	}

	.center {
		width: 100%;
		display: flex;
		justify-content: center;
	}

	.search-row {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5em;
	}

	.advanced-filters {
		display: flex;
		flex-direction: column;

		align-items: center;
		gap: 1em;

		background-color: rgba(0, 0, 0, 0.05);
		border-radius: 16px;
		padding: 1em 1em 1em 0.5em;

		box-shadow: #bbb 0 1px 10px;

		width: max-content;
		margin: 1em auto;

		max-width: 90vw;
	}

	.filters-header {
		font-weight: 600;
	}

	.sort-row {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0.5em;
	}

	.sort-row :global(.active) {
		border: solid rgba(0, 0, 0, 0.4) 1px;
		background-color: rgba(0, 0, 0, 0.1);
	}
</style>
