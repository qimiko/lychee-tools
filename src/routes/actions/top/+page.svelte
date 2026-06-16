<script lang="ts">
	import Title from '$lib/components/core/Title.svelte';
	import Link from '$lib/components/core/Link.svelte';
	import { resolve } from '$app/paths';
	import type { ServerTopActionUser } from '$lib/api/index.js';

	let { data } = $props();

	const top_by_permissions = $derived(
		Object.groupBy(data.top_actions, ({ permissions }) => Math.min(permissions, 2))
	);
</script>

<svelte:head>
	<title>Mod Actions - 1.9 GDPS</title>
	<meta name="og:site_name" content="1.9 GDPS" />
	<meta name="og:title" content="Mod Actions" />
</svelte:head>

<Title>Mod Actions</Title>

{#snippet drawTopTable(items: ServerTopActionUser[])}
	<table>
		<thead>
			<tr>
				<th>Username</th>
				<th>Actions</th>
				<th>Rated Levels</th>
			</tr>
		</thead>
		<tbody>
			{#each items as item (item.id)}
				<tr>
					<td>
						<Link
							href={resolve('/accounts/[id]/manage', {
								id: item.id.toString()
							})}
						>
							{item.username}
						</Link>
					</td>
					<td>{item.all_actions}</td>
					<td>{item.rate_actions}</td>
				</tr>
			{/each}
		</tbody>
	</table>
{/snippet}

<Title size={2}>Admins</Title>

{#if 2 in top_by_permissions && top_by_permissions[2]}
	{@render drawTopTable(top_by_permissions[2])}
{/if}

<Title size={2}>Moderators</Title>

{#if 1 in top_by_permissions && top_by_permissions[1]}
	{@render drawTopTable(top_by_permissions[1])}
{/if}

<Title size={2}>Ex-Moderators</Title>

{#if 0 in top_by_permissions && top_by_permissions[0]}
	{@render drawTopTable(top_by_permissions[0])}
{/if}
