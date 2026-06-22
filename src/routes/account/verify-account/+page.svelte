<script>
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { env } from '$env/dynamic/public';
	import Button from '$lib/components/core/Button.svelte';
	import Title from '$lib/components/core/Title.svelte';
	import { Turnstile } from 'svelte-turnstile';

	let { form } = $props();
</script>

<svelte:head>
	<title>Verify Account - 1.9 GDPS</title>
	<meta name="og:site_name" content="1.9 GDPS" />
	<meta name="og:title" content="Verify Account" />
</svelte:head>

<Title>Verify Account</Title>

<form method="POST" use:enhance>
	{#if form?.success}
		<p>Account successfully activated! You may now log into your 1.9 GDPS account.</p>

		<Button href={resolve('/account/login')}>Log In</Button>
	{:else}
		{#if form?.error}
			<p>{form.error}</p>
		{/if}

		<input type="hidden" name="key" value={page.url.searchParams.get('k')} />

		{#if env.PUBLIC_TURNSTILE_SITE_KEY}
			<Turnstile siteKey={env.PUBLIC_TURNSTILE_SITE_KEY} action="reset-finish" />
		{:else}
			<input type="hidden" name="cf-turnstile-response" value="dummy" />
		{/if}

		<div>
			<Button type="submit">Activate</Button>
		</div>
	{/if}
</form>
