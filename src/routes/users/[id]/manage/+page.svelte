<script lang="ts">
	import { formatTimestamp } from '$lib';
	import Title from '$lib/components/core/Title.svelte';
	import { enhance } from '$app/forms';
	import FormInput from '$lib/components/core/FormInput.svelte';
	import type { BanType } from '$lib/api/index.js';

	import X from '@lucide/svelte/icons/x';
	import IconButton from '$lib/components/core/IconButton.svelte';

	let { data, form } = $props();

	const ban_types = [
		{ value: 'leaderboard', name: 'Leaderboard' },
		{ value: 'send', name: 'Send' },
		{ value: 'creator', name: 'Creator' },
		{ value: 'comment', name: 'Comment' }
	];

	const remaining_ban_types = $derived(
		ban_types.filter(({ value }) => !data.bans.map((b) => b.type).includes(value as BanType))
	);
</script>

<svelte:head>
	<title>Manage {data.user.name} - 1.9 GDPS</title>
	<meta name="og:site_name" content="1.9 GDPS" />
	<meta name="og:title" content={`Manage ${data.user.name}`} />
</svelte:head>

<Title size={2}>Manage User</Title>

{#if data.bans.length != 0}
	{#if form?.error && form.type == 'remove_ban'}
		<p>{form.error}</p>
	{:else if form?.success && form.type == 'remove_ban'}
		<p>Ban removed!</p>
	{/if}

	<table>
		<thead>
			<tr>
				<th>Time</th>
				<th>Type</th>
				<th>Reason</th>
				<th>Action</th>
			</tr>
		</thead>
		<tbody>
			{#each data.bans as item (item.type)}
				<tr>
					<td>{formatTimestamp(item.created)}</td>
					<td>{item.type}</td>
					<td>{item.reason}</td>
					<td style="padding: 0.5em;">
						<form method="POST" use:enhance action="?/remove_ban">
							<input type="hidden" name="key" value={item.type} />
							<IconButton type="submit"><X /></IconButton>
						</form>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
{/if}

{#if remaining_ban_types.length > 0}
	{#if data.bans.length != 0}
		<hr />

		<h2>Create ban</h2>
	{/if}

	{#if form?.error && form.type == 'add_ban'}
		<p>{form.error}</p>
	{:else if form?.success && form.type == 'add_ban'}
		<p>Ban added!</p>
	{/if}

	<form method="POST" use:enhance action="?/add_ban">
		<label>
			Ban type:

			<select name="type">
				{#each remaining_ban_types as type (type.value)}
					<option value={type.value}>{type.name}</option>
				{/each}
			</select>
		</label>

		<FormInput type="text" label="Reason" name="reason" required />

		<FormInput type="submit" value="Ban" />
	</form>
{/if}
