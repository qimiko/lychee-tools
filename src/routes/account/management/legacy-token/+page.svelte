<script>
	import { enhance } from '$app/forms';
	import Button from '$lib/components/core/Button.svelte';
	import FormInput from '$lib/components/core/FormInput.svelte';
	import Title from '$lib/components/core/Title.svelte';

	let { data, form } = $props();
</script>

<svelte:head>
	<title>Create Legacy Token - 1.9 GDPS</title>
	<meta name="og:site_name" content="1.9 GDPS" />
	<meta name="og:title" content="Create Legacy Token" />
</svelte:head>

<Title>Create Legacy Token</Title>

<p>A legacy authentication token is required to use the 1.9 GDPS with 2.2 clients.</p>

{#if data.extra_details.has_legacy_token}
	<p>
		As you already have a token, pressing "Get Token" will immediately reset your previous token,
		requiring you to "Refresh Login" on all 2.2 clients.
	</p>
{/if}

<form method="POST" use:enhance>
	{#if form?.error}
		<p>{form.error}</p>
	{:else if form?.success}
		<p>Success! Your token is:</p>
		<pre>{form.token}</pre>
		<p>Please save the token somewhere safe! It will not be visible after closing the page.</p>
	{/if}

	<FormInput type="password" label="Password" name="password" required />

	<div>
		<Button type="submit">Get Token</Button>
	</div>
</form>

<style>
	pre {
		user-select: all;
		-webkit-user-select: all;
	}
</style>
