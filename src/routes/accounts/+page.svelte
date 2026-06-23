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
	import { formatTimestamp } from '$lib';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let page = $derived(data.params.page ?? 0);
	let query = $derived(data.params.query ?? '');
	let sort = $derived(data.params.sort);
	let count = $derived(data.params.count ?? 50);

	async function updateQueryParams() {
		// eslint-disable-next-line svelte/prefer-svelte-reactivity
		const params = new URLSearchParams();
		params.set('page', page.toString());
		params.set('count', count.toString());

		if (query) {
			params.set('query', query);
		}

		if (sort) {
			params.set('sort', sort);
		}

		// eslint-disable-next-line svelte/no-navigation-without-resolve
		await goto(`${resolve('/accounts')}?${params}`, {
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
	<title>Search Accounts - 1.9 GDPS</title>
	<meta name="og:site_name" content="1.9 GDPS" />
	<meta name="og:title" content="Search Accounts" />
</svelte:head>

<Title>Search Accounts</Title>

<form onsubmit={onSearch}>
	<div class="search-row">
		<FormInput placeholder="Account name or ID" type="text" bind:value={query} />
		<IconButton type="submit">
			<Search />
		</IconButton>
	</div>

	<label for="type-select-top"> Sort by: </label>
	<select
		id="type-select-top"
		bind:value={sort}
		onchange={() => {
			page = 0;
			updateQueryParams();
		}}
	>
		<option value="registered">Registration Time</option>
		<option value="name">Name</option>
	</select>
</form>

<div>
	<Pagination
		count={data.accounts.count}
		pageCount={data.accounts.items.length}
		perPage={data.params.count ?? 50}
		page={data.params.page ?? 0}
		pluralName="accounts"
		singularName="account"
		onSelect={async (x) => {
			page = x;
			await updateQueryParams();
		}}
	/>
</div>

{#if data.accounts.count == 0}
	<div>No accounts were found!</div>
{:else}
	<div class="table-container">
		<table>
			<thead>
				<tr>
					<th>ID</th>
					<th>User</th>
					<th>Name</th>
					<th>Registered</th>
				</tr>
			</thead>
			<tbody>
				{#each data.accounts.items as item (item.id)}
					<tr>
						<td>
							{#if data.current_user && data.current_user.permission_level >= 1}
								<Link href={resolve('/accounts/[id]/manage', { id: item.id.toString() })}>
									{item.id}
								</Link>
							{:else}
								{item.id}
							{/if}
						</td>
						<td>
							{#if item.user_id}
								<Link href={resolve('/users/[id]', { id: item.user_id.toString() })}>
									{item.user_id}
								</Link>
							{:else}
								-
							{/if}
						</td>
						<td>{item.username}</td>
						<td>{formatTimestamp(item.created)}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<div>
		<Pagination
			count={data.accounts.count}
			pageCount={data.accounts.items.length}
			perPage={data.params.count ?? 50}
			page={data.params.page ?? 0}
			pluralName="accounts"
			singularName="account"
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
