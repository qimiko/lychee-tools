<script lang="ts">
	import type { PageData } from './$types.js';

	import Title from '$lib/components/core/Title.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import { resolve } from '$app/paths';
	import { goto } from '$app/navigation';
	import FormInput from '$lib/components/core/FormInput.svelte';
	import UserCell from '$lib/components/cells/UserCell.svelte';
	import IconButton from '$lib/components/core/IconButton.svelte';
	import Search from '@lucide/svelte/icons/search';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let page = $derived(data.params.page ?? 0);
	let query = $derived(data.params.query ?? '');
	let count = $derived(data.params.count ?? 25);

	async function updateQueryParams() {
		const params = new URLSearchParams();
		params.set('page', page.toString());
		params.set('count', count.toString());

		if (query) {
			params.set('query', query);
		}

		await goto(`${resolve('/users')}?${params}`, {
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
	<title>Search Users - 1.9 GDPS</title>
	<meta name="og:site_name" content="1.9 GDPS" />
	<meta name="og:title" content="Search Users" />
</svelte:head>

<Title>Search Users</Title>

<form onsubmit={onSearch}>
	<div class="search-row">
		<FormInput placeholder="Username or User ID" type="text" bind:value={query} />
		<IconButton type="submit">
			<Search />
		</IconButton>
	</div>
</form>

{#if data.params.query !== undefined}
	<div>
		<Pagination
			count={data.users.count}
			pageCount={data.users.items.length}
			perPage={data.params.count ?? 25}
			page={data.params.page ?? 0}
			pluralName="users"
			singularName="user"
			onSelect={async (x) => {
				page = x;
				await updateQueryParams();
			}}
		/>
	</div>

	{#if data.users.count == 0}
		<div>No users were found!</div>
	{:else}
		<div class="center">
			<div class="users-container">
				{#each data.users.items as user (user.id)}
					<UserCell {user} />
				{/each}
			</div>
		</div>

		<div>
			<Pagination
				count={data.users.count}
				pageCount={data.users.items.length}
				perPage={data.params.count ?? 50}
				page={data.params.page ?? 0}
				pluralName="users"
				singularName="user"
				onSelect={async (x) => {
					page = x;
					await updateQueryParams();
				}}
			/>
		</div>
	{/if}
{/if}

<style>
	.users-container {
		display: flex;
		flex-direction: column;

		gap: 1em;
	}

	.center {
		display: flex;
		justify-content: center;

		width: 100%;
	}

	.search-row {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5em;

		margin-bottom: 1em;
	}
</style>
