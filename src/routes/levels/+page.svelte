<script lang="ts">
	import LevelCell from '$lib/components/cells/LevelCell.svelte';
	import Title from '$lib/components/core/Title.svelte';
	import type { PageData } from './$types.js';
	import logo from '$lib/assets/ogp-icon.png';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import Pagination from '$lib/components/Pagination.svelte';
	import FormInput from '$lib/components/core/FormInput.svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let page = $derived(data.params.page ?? 0);
	let query = $derived(data.params.query ?? '');
	let type = $derived(data.params.type ?? 'search_string');
	let epic = $derived(data.params.epic ?? false);
	let star = $derived(data.params.star ?? false);
	let count = $derived(data.params.count ?? 25);
	let no_points = $derived(data.params.no_points ?? false);
	let no_reupload = $derived(data.params.no_reupload ?? false);

	async function updateQueryParams() {
		const params = new URLSearchParams();
		params.set('page', page.toString());
		params.set('count', count.toString());
		params.set('type', type);

		if (query) {
			params.set('query', query);
		}

		if (epic) {
			params.set('epic', 'true');
		}

		if (star) {
			params.set('star', 'true');
		}

		if (no_points) {
			params.set('no_points', 'true');
		}

		if (no_reupload) {
			params.set('no_reupload', 'true');
		}

		await goto(`${resolve('/levels')}?${params}`, {
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
	<title>Search Levels - 1.9 GDPS</title>
	<meta name="og:title" content="1.9 GDPS" />
	<meta name="og:image" content={logo} />
</svelte:head>

<Title>Search Levels</Title>

<form onsubmit={onSearch}>
	<FormInput placeholder="Query" type="text" bind:value={query} />
	<FormInput type="submit" value="Search" />
</form>

<Pagination
	count={data.levels.count}
	pageCount={data.levels.items.length}
	perPage={data.params.count ?? 25}
	page={data.params.page ?? 0}
	pluralName="levels"
	singularName="level"
	onSelect={async (x) => {
		page = x;
		await updateQueryParams();
	}}
/>

<div class="center">
	<div class="level-row">
		{#each data.levels.items as level (level.id)}
			<LevelCell {level} />
		{/each}
	</div>
</div>

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
</style>
