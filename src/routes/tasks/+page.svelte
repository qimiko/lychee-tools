<script lang="ts">
	import { formatTimestamp } from '$lib';
	import Title from '$lib/components/core/Title.svelte';
	import Button from '$lib/components/core/Button.svelte';
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';

	let { data, form } = $props();
</script>

<svelte:head>
	<title>Cron Jobs - 1.9 GDPS</title>
	<meta name="og:site_name" content="1.9 GDPS" />
	<meta name="og:title" content="Cron Jobs" />
</svelte:head>

<Title size={2}>Cron Jobs</Title>

{#if form?.error}
	<p>{form.error}</p>
{:else if form?.success}
	<p>Task scheduled!</p>
{/if}

{#if data.tasks.length == 0}
	<div>No tasks available!</div>
{:else}
	<table>
		<thead>
			<tr>
				<th>Name</th>
				<th>Last Execution</th>
				<th>Next Execution</th>
				<th>Action</th>
			</tr>
		</thead>
		<tbody>
			{#each data.tasks as item (item.name)}
				<tr>
					<td>{item.name}</td>
					<td>{item.last_executed ? formatTimestamp(item.last_executed) : '-'}</td>
					<td>{item.next_execution ? formatTimestamp(item.next_execution) : '-'}</td>
					<td>
						<form use:enhance method="POST">
							<Button type="submit" value={item.name} name="action">Run</Button>
						</form>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
{/if}

<div style="padding: 1em;"></div>

<Button onclick={async () => await invalidateAll()}>Refresh</Button>

<style>
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
