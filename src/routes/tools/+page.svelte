<script lang="ts">
	import LinkButton from '$lib/components/core/LinkButton.svelte';
	import Title from '$lib/components/core/Title.svelte';

	import { resolve } from '$app/paths';

	let { data } = $props();
</script>

<svelte:head>
	<title>Tools - 1.9 GDPS</title>
	<meta name="og:title" content="1.9 GDPS" />
	<meta name="og:description" content="Management tools for the 1.9 GDPS." />
</svelte:head>

<div>
	<Title size={2}>My Account</Title>
	{#if data.current_user}
		<LinkButton href={resolve('/account/management')}>Manage Account</LinkButton>
	{:else}
		<p>
			<LinkButton href={resolve('/account/register')}>Register</LinkButton>
			<LinkButton href={resolve('/account/login')}>Login</LinkButton>
			<LinkButton href={resolve('/account/forgot-password')}>Forgot Password</LinkButton>
			<LinkButton href={resolve('/account/resend-activation')}>Resend Activation Email</LinkButton>
		</p>
	{/if}

	<Title size={2}>Levels</Title>
	<p>
		<LinkButton href={resolve('/levels')}>Search Levels</LinkButton>
		{#if data.current_user}
			<LinkButton href={resolve('/levels/reupload')}>Level Reupload</LinkButton>
		{/if}
		<LinkButton href={resolve('/levels/packs')}>Map Packs</LinkButton>
		<LinkButton href={resolve('/levels/most-reported')}>Reported Levels</LinkButton>
		<LinkButton href={resolve('/comments')}>Level Comments</LinkButton>
		<LinkButton href={resolve('/levels/sent')}>Sent Levels</LinkButton>
	</p>

	<Title size={2}>Songs</Title>
	<p>
		{#if data.current_user}
			<LinkButton href={resolve('/songs/reupload')}>Song Reupload</LinkButton>
		{/if}
		<LinkButton href={resolve('/songs')}>Song List</LinkButton>
	</p>

	<Title size={2}>Users</Title>
	<p>
		<LinkButton href={resolve('/leaderboards')}>Leaderboards</LinkButton>
		<LinkButton href={resolve('/users')}>Search Users</LinkButton>
	</p>

	<Title size={2}>Other</Title>
	<p>
		{#if data.current_user && data.current_user.permission_level >= 2}
			<LinkButton href={resolve('/tasks')}>Cron Job</LinkButton>
		{/if}

		<LinkButton href={resolve('/stats/server-info')}>Server Info</LinkButton>
	</p>

	<Title size={2}>Moderation</Title>
	<p>
		{#if data.current_user && data.current_user.permission_level >= 1}
			<LinkButton href={resolve('/actions/top')}>Top Actions</LinkButton>
			<LinkButton href={resolve('/actions')}>Mod Actions</LinkButton>
		{/if}
		{#if data.current_user && data.current_user.permission_level >= 1}
			<LinkButton href={resolve('/levels/packs/create')}>Create Map Pack</LinkButton>
		{/if}
		<LinkButton href={resolve('/levels/shared-points')}>Shared Points</LinkButton>
	</p>
</div>
