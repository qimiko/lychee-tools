<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import Link from '$lib/components/core/Link.svelte';
	import UserHeader from '$lib/components/UserHeader.svelte';

	import Shield from '@lucide/svelte/icons/shield';

	let { children, data } = $props();
</script>

<UserHeader user={data.user} />

<div class="header-links">
	{#if data.current_user && data.current_user.account_id == data.user.account_id}
		<div>
			<Link href={resolve('/account/management')}>Manage Account</Link>
		</div>
	{/if}

	{#if page.route.id != '/users/[id]'}
		<div>
			<Link href={resolve('/users/[id]', { id: data.user.id.toString() })}>Main Page</Link>
		</div>
	{/if}

	{#if page.route.id != '/users/[id]/history'}
		<div>
			<Link href={resolve('/users/[id]/history', { id: data.user.id.toString() })}
				>Stats History</Link
			>
		</div>
	{/if}

	{#if data.current_user && data.current_user.permission_level >= 1 && page.route.id != '/users/[id]/manage'}
		<div>
			<Link href={resolve('/users/[id]/manage', { id: data.user.id.toString() })}
				>Moderate User</Link
			>
		</div>
	{/if}
</div>

{#if data.current_user && data.current_user.permission_level >= 1}
	<div class="header-links">
		<div class="no-bullet">
			<Shield class="link-icon" />
		</div>

		{#if data.current_user && data.current_user.permission_level >= 1}
			<div>
				<Link href={resolve('/comments') + `?user=${data.user.id}`}>Manage Comments</Link>
			</div>
		{/if}

		{#if data.user.account_id && data.current_user.permission_level >= 2}
			<div>
				<Link
					href={resolve('/accounts/[id]/manage', {
						id: data.user.account_id.toString()
					})}>Administrate Account</Link
				>
			</div>
		{/if}

		{#if data.user.account_id && data.current_user.permission_level >= 1}
			<div>
				<Link
					href={resolve('/actions') + `?by_user=${data.user.id}&by_account=${data.user.account_id}`}
					>View Actions</Link
				>
			</div>
		{:else if data.current_user.permission_level >= 1}
			<div>
				<Link href={resolve('/actions') + `?by_user=${data.user.id}`}>View Actions</Link>
			</div>
		{/if}
	</div>
{/if}

{@render children()}

<style>
	.header-links {
		display: flex;
		justify-content: center;
		padding-top: 1em;
		flex-wrap: wrap;

		align-items: center;
	}

	.header-links > *:not(.no-bullet):not(:last-child)::after {
		content: '•';
		padding: 0 0.5em;
	}

	.no-bullet {
		padding: 0 0.25em;
	}
</style>
