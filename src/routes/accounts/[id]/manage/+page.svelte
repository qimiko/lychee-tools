<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import Button from '$lib/components/core/Button.svelte';
	import Link from '$lib/components/core/Link.svelte';
	import Title from '$lib/components/core/Title.svelte';

	let { data, form } = $props();

	const current_permissions = $derived(data.current_user?.permission_level ?? 0);

	const can_manage = $derived(
		current_permissions >= 3 || current_permissions > data.account.permission_level
	);
</script>

<svelte:head>
	<title>Manage {data.account.name} - 1.9 GDPS</title>
	<meta name="og:site_name" content="1.9 GDPS" />
	<meta name="og:title" content={`Manage ${data.account.name}`} />
</svelte:head>

<Title>Manage Account</Title>

Currently managing account <b>{data.account.name}</b>.

<p>
	{#if data.account.user?.id}
		<Link
			href={resolve('/users/[id]', {
				id: data.account.user.id.toString()
			})}>View User</Link
		>
	{/if}
</p>

{#if form?.error}
	<p>{form.error}</p>
{:else if form?.success}
	<p>Account modified!</p>
{/if}

<form use:enhance method="POST" action="?/role">
	{#if can_manage}
		<h2>Role Management</h2>
	{/if}

	{#if current_permissions >= 2}
		{#if data.account.permission_level == 1}
			<Button type="submit" name="level" value={0} buttonStyle="secondary">Demote to User</Button>
		{:else if data.account.permission_level < 1}
			<Button type="submit" name="level" value={1}>Promote to Moderator</Button>
		{/if}
	{/if}

	{#if current_permissions >= 3}
		{#if data.account.permission_level == 2}
			<Button type="submit" name="level" value={0} buttonStyle="secondary">Demote to User</Button>
			<Button type="submit" name="level" value={1} buttonStyle="secondary"
				>Demote to Moderator</Button
			>
		{:else if data.account.permission_level < 2}
			<Button type="submit" name="level" value={2}>Promote to Admin</Button>
		{/if}
	{/if}

	{#if current_permissions >= 3}
		{#if data.account.permission_level == 3}
			<Button type="submit" name="level" value={0} buttonStyle="secondary">Demote to User</Button>
			<Button type="submit" name="level" value={1} buttonStyle="secondary"
				>Demote to Moderator</Button
			>
			<Button type="submit" name="level" value={2} buttonStyle="secondary">Demote to Admin</Button>
		{:else}
			<Button type="submit" name="level" value={3}>Promote to Owner</Button>
		{/if}
	{/if}
</form>

{#if current_permissions >= 3 && data.account.account_id != data.current_user?.account_id}
	<form use:enhance method="POST" action="?/verify">
		<h2>Security Options</h2>

		<Button type="submit" name="reset" value={0}>Verify Account</Button>

		<Button type="submit" name="reset" value={1} buttonStyle="emphasis"
			>Force Unverify Account</Button
		>

		<p>
			(Force unverifying an account will require that user to go through
			<Link href={resolve('/account/resend-activation')}>E-Mail Activation</Link>
			to use their account again.)
		</p>
	</form>
{/if}

{#if !can_manage && current_permissions < 3}
	<div>No actions available for you! :(</div>
{/if}
