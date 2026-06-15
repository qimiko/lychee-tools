<script lang="ts">
	import Title from '$lib/components/core/Title.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import { resolve } from '$app/paths';
	import { goto } from '$app/navigation';
	import FormInput from '$lib/components/core/FormInput.svelte';
	import { formatTimestamp } from '$lib';
	import Button from '$lib/components/core/Button.svelte';
	import Link from '$lib/components/core/Link.svelte';

	let { data } = $props();

	let page = $derived(data.params.page ?? 0);
	let count = $derived(data.params.count ?? 250);
	let selected_types = $derived(data.params.types ?? []);
	let on_id = $derived(data.params.on_id);
	let by_account = $derived(data.params.by_account);
	let by_user = $derived(data.params.by_user);
	let by_ip = $derived(data.params.by_ip);

	let show_ip = $state(false);

	async function updateQueryParams() {
		const params = new URLSearchParams();
		params.set('page', page.toString());
		params.set('count', count.toString());

		if (selected_types.length > 0) {
			for (const type of selected_types) {
				params.append('type', type);
			}
		}

		if (on_id) {
			params.set('on_id', on_id.toString());
		}

		if (by_user) {
			params.set('by_user', by_user.toString());
		}

		if (by_ip) {
			params.set('by_ip', by_ip);
		}

		if (by_account) {
			params.set('by_account', by_account.toString());
		}

		await goto(`${resolve('/actions')}?${params}`, {
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
	<title>Actions - 1.9 GDPS</title>
	<meta name="og:site_name" content="1.9 GDPS" />
	<meta name="og:title" content="Actions" />
</svelte:head>

<Title>Actions</Title>

<form onsubmit={onSearch}>
	{#if by_account || by_user || on_id || by_ip}
		<p>
			{#if by_account}
				By account id: <Link
					href={resolve('/accounts/[id]', {
						id: by_account.toString()
					})}>{by_account}</Link
				> <br />
			{/if}

			{#if by_user}
				By user id: <Link
					href={resolve('/users/[id]', {
						id: by_user.toString()
					})}>{by_user}</Link
				> <br />
			{/if}

			{#if by_ip}
				By IP Address: {by_ip} <br />
			{/if}

			{#if on_id}
				Only on ID: {on_id} <br />
			{/if}

			<Button
				onclick={() => {
					by_account = undefined;
					by_user = undefined;
					on_id = undefined;
					by_ip = undefined;

					page = 0;
					updateQueryParams();
				}}>Clear Filters</Button
			>
		</p>
	{/if}

	<label>
		Filter types:
		<select name="type" multiple bind:value={selected_types}>
			<option value="level_rate">Level Rate</option>
			<option value="level_update">Level Update</option>
			<option value="level_upload">Level Upload</option>
			<option value="level_edit">Level Edit</option>
			<option value="level_publicity">Level Publicity</option>
			<option value="legacy_pack_edit">Legacy Pack Edit</option>
			<option value="pack_create">Pack Create</option>
			<option value="pack_edit">Pack Edit</option>
			<option value="level_reupload">Level Reupload</option>
			<option value="level_delete">Level Delete</option>
			<option value="comment_delete">Comment Delete</option>
			<option value="comment_bulk_manage">Comment Bulk Manage</option>
			<option value="legacy_level_account">Legacy Level Account</option>
			<option value="legacy_share_points">Legacy Share Points</option>
			<option value="clear_shared_points">Clear Shared Points</option>
			<option value="share_points">Share Points</option>
			<option value="create_ban">Create Ban</option>
			<option value="remove_ban">Remove Ban</option>
			<option value="song_reupload">Song Reupload</option>
			<option value="song_edit">Song Edit</option>
			<option value="account_edit">Account Edit</option>
		</select>
	</label>

	<FormInput type="submit" value="Search" />
</form>

{#if data.current_user && data.current_user.permission_level >= 3}
	<label>
		Show IP:
		<input type="checkbox" bind:checked={show_ip} />
	</label>
{/if}

<div>
	<Pagination
		count={data.actions.count}
		pageCount={data.actions.items.length}
		perPage={data.params.count ?? 50}
		page={data.params.page ?? 0}
		pluralName="actions"
		singularName="action"
		onSelect={async (x) => {
			page = x;
			await updateQueryParams();
		}}
	/>
</div>

{#if data.actions.count == 0}
	<div>No actions were found!</div>
{:else}
	<div class="table-container">
		<table>
			<thead>
				<tr>
					<th>ID</th>
					<th>By</th>
					<th>Type</th>
					<th>On</th>
					<th>Value 1</th>
					<th>Value 2</th>
				</tr>
			</thead>
			<tbody>
				{#each data.actions.items as item (item.id)}
					<tr>
						<td>{formatTimestamp(item.timestamp)}</td>
						<td>
							{#if item.user_id}
								<Link
									href="#"
									onclick={() => {
										by_user = item.user_id ?? undefined;
										updateQueryParams();
									}}
								>
									U:{item.user_id}
								</Link>
							{/if}
							{#if item.account_id}
								<Link
									href="#"
									onclick={() => {
										by_account = item.account_id ?? undefined;
										updateQueryParams();
									}}
								>
									A:{item.account_id}
								</Link>
							{/if}
							{#if item.ip && show_ip}
								<Link
									href="#"
									onclick={() => {
										by_ip = item.ip ?? undefined;
										updateQueryParams();
									}}
								>
									I:{item.ip}
								</Link>
							{/if}
						</td>
						<td>{item.type}</td>
						<td>
							<Link
								href="#"
								onclick={() => {
									on_id = item.on_id ?? undefined;
									updateQueryParams();
								}}
							>
								{item.on_id ?? '-'}
							</Link>
						</td>
						<td>
							{#if 'value1' in item}
								{#if typeof item.value1 == 'object'}
									{JSON.stringify(item.value1)}
								{:else}
									{item.value1}
								{/if}
							{/if}
						</td>
						<td>
							{#if 'value2' in item}
								{#if typeof item.value2 == 'object'}
									{JSON.stringify(item.value2)}
								{:else}
									{item.value2}
								{/if}
							{/if}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<div>
		<Pagination
			count={data.actions.count}
			pageCount={data.actions.items.length}
			perPage={data.params.count ?? 50}
			page={data.params.page ?? 0}
			pluralName="actions"
			singularName="action"
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
</style>
