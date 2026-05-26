<script>
	import { enhance } from '$app/forms';
	import { env } from '$env/dynamic/public';
	import FormInput from '$lib/components/core/FormInput.svelte';
	import Title from '$lib/components/core/Title.svelte';
	import { Turnstile } from 'svelte-turnstile';

	let { form } = $props();
</script>

<svelte:head>
	<title>Resend Activation Email - 1.9 GDPS</title>
	<meta name="og:site_name" content="1.9 GDPS" />
	<meta name="og:title" content="Resend Activation Email" />
</svelte:head>

<Title>Resend Activation</Title>

<form method="POST" use:enhance>
	{#if form?.error}
		<p>{form.error}</p>
	{:else if form?.success}
		<p>
			Success, check your email to continue. If you don't receive an email after 10 minutes, try
			again
		</p>
	{/if}

	<FormInput type="email" label="Email" name="email" value={form?.email ?? ''} required />

	{#if env.PUBLIC_TURNSTILE_SITE_KEY}
		<Turnstile siteKey={env.PUBLIC_TURNSTILE_SITE_KEY} action="reset" />
	{:else}
		<input type="hidden" name="cf-turnstile-response" value="dummy" />
	{/if}

	<div>
		<FormInput type="submit" value="Get Reset Email" />
	</div>
</form>
