<script lang="ts">
	import Title from '$lib/components/core/Title.svelte';

	import Music from '@lucide/svelte/icons/music';
	import ListMusic from '@lucide/svelte/icons/list-music';
	import Users from '@lucide/svelte/icons/users';
	import UserSearch from '@lucide/svelte/icons/user-search';
	import Folders from '@lucide/svelte/icons/folders';
	import Search from '@lucide/svelte/icons/search';
	import Trophy from '@lucide/svelte/icons/trophy';
	import MessageSquare from '@lucide/svelte/icons/message-square';
	import ChartColumn from '@lucide/svelte/icons/chart-column';
	import Shield from '@lucide/svelte/icons/shield';
	import Play from '@lucide/svelte/icons/play';
	import Settings from '@lucide/svelte/icons/settings';
	import { page } from '$app/state';

	import { resolve } from '$app/paths';
	import Link from '$lib/components/core/Link.svelte';
	import Button from '$lib/components/core/Button.svelte';

	let { data } = $props();

	const show_logout_message = $derived(page.url.searchParams.get('logout') == 'true');
</script>

<svelte:head>
	<title>Tools - 1.9 GDPS</title>
	<meta name="og:site_name" content="1.9 GDPS" />
	<meta name="og:title" content="Available Tools" />
</svelte:head>

<Title size={1}>Available Tools</Title>

<div class="account-management">
	{#if show_logout_message}
		<p>You are now logged out!</p>
	{/if}

	{#if !data.current_user}
		<h2><Settings /> Account</h2>
	{/if}

	<div class="button-row">
		{#if data.current_user}
			<Button href={resolve('/account/management')} icon={Settings}>Manage Account</Button>
		{:else}
			<Button href={resolve('/account/register')} buttonStyle="secondary">Register</Button>
			<Button href={resolve('/account/login')}>Login</Button>
		{/if}
	</div>

	{#if !data.current_user}
		<div class="account-recovery">
			<Link href={resolve('/account/forgot-password')}>Forgot Password</Link>
			<Link href={resolve('/account/resend-activation')}>Resend Activation Email</Link>
		</div>
	{/if}
</div>

<div class="links-row">
	<div class="links-container">
		<h2><Play /> Levels</h2>

		<Link href={resolve('/levels')} icon={Search}>Search Levels</Link>
		<Link href={resolve('/levels/packs')} icon={Folders}>Map Packs</Link>
		{#if data.current_user}
			<Link href={resolve('/levels/reupload')}>Level Reupload</Link>
		{/if}
		{#if data.current_user && data.current_user.permission_level >= 1}
			<Link href={resolve('/levels/packs/create')}>Create Map Pack</Link>
		{/if}
		<Link href={resolve('/levels/shared-points')}>Shared Points</Link>
		<Link href={resolve('/levels/most-reported')}>Reported Levels</Link>
		<Link href={resolve('/levels/sent')}>Sent Levels</Link>
	</div>

	<div class="links-container">
		<h2><Music /> Songs</h2>
		<Link href={resolve('/songs')} icon={ListMusic}>Song List</Link>
		{#if data.current_user}
			<Link href={resolve('/songs/reupload')}>Song Reupload</Link>
		{/if}
	</div>

	<div class="links-container">
		<h2><Users /> Users</h2>
		<Link href={resolve('/leaderboards')} icon={Trophy}>Leaderboards</Link>
		<Link href={resolve('/users')} icon={UserSearch}>Search Users</Link>
	</div>

	<div class="links-container">
		<h2><Shield /> Other</h2>
		<Link href={resolve('/stats/server-info')} icon={ChartColumn}>Server Info</Link>
		<Link href={resolve('/comments')} icon={MessageSquare}>Comments</Link>

		<Link href={resolve('/accounts')}>Search Accounts</Link>

		{#if data.current_user && data.current_user.permission_level >= 1}
			<Link href={resolve('/actions/top')}>Top Actions</Link>
			<Link href={resolve('/actions')}>Mod Actions</Link>
		{/if}
		{#if data.current_user && data.current_user.permission_level >= 2}
			<Link href={resolve('/tasks')}>Cron Job</Link>
		{/if}
	</div>
</div>

<style>
	.links-container {
		display: flex;
		flex-direction: column;

		align-items: start;

		gap: 0.25rem;
	}

	.links-row {
		display: flex;
		flex-wrap: wrap;

		gap: 3em;

		width: 100%;
		justify-content: center;
		align-items: start;
	}

	.links-row h2 {
		margin-bottom: 0.25em;
	}

	h2 {
		display: flex;
		gap: 0.5rem;

		align-items: center;

		margin: 0;
	}

	.account-management {
		display: flex;
		flex-direction: column;

		align-items: center;

		margin-bottom: 2em;
		gap: 0.5rem;
	}

	.account-recovery {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}
</style>
