<script>
	import { enhance } from '$app/forms';
	import FormInput from '$lib/components/core/FormInput.svelte';
	import Link from '$lib/components/core/Link.svelte';
	import LinkButton from '$lib/components/core/LinkButton.svelte';
	import Title from '$lib/components/core/Title.svelte';

	import { resolve } from '$app/paths';

	let { form } = $props();
</script>

<svelte:head>
	<title>Login - 1.9 GDPS</title>
	<meta name="og:title" content="1.9 GDPS" />
	<meta name="og:description" content="Login to a 1.9 GDPS account." />
</svelte:head>

<Title>Login</Title>

<form method="POST" use:enhance>
	{#if form?.error}
		<p>{form.error}</p>
	{/if}

	<FormInput type="text" label="Username" name="userName" value={form?.userName ?? ''} required />

	<FormInput type="password" label="Password" name="password" required />

	<div>
		<LinkButton>Register</LinkButton>

		<FormInput type="submit" value="Login" />
	</div>
</form>

<p>
	<Link href={resolve('/account/forgot-password')}>Forgot password?</Link>
</p>
