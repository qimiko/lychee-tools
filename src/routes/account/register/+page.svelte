<script>
	import { enhance } from '$app/forms';
	import FormInput from '$lib/components/core/FormInput.svelte';
	import Title from '$lib/components/core/Title.svelte';

	let { form } = $props();

	let confirm_password = $state('');
	let password = $state('');

	let email = $derived(form?.email ?? '');
	let confirm_email = $state('');

	const passwords_confirmed = $derived(password.length == 0 || confirm_password == password);
	const emails_confirmed = $derived(email.length == 0 || confirm_email == email);
</script>

<svelte:head>
	<title>Register Account - 1.9 GDPS</title>
	<meta name="og:site_name" content="1.9 GDPS" />
	<meta name="og:title" content="Register Account" />
</svelte:head>

<Title>Register Account</Title>

<form method="POST" use:enhance>
	{#if form?.error}
		<p>{form.error}</p>
	{:else if form?.success}
		<p>Account created! Please check your email to activate your account.</p>
	{/if}

	<FormInput
		type="text"
		label="Username"
		name="userName"
		minlength={3}
		maxlength={20}
		value={form?.userName ?? ''}
		required
	/>

	<FormInput
		type="password"
		label="Password"
		name="password"
		minlength={6}
		maxlength={20}
		bind:value={password}
		required
	/>
	<FormInput
		type="password"
		label="Repeat Password"
		name="confirm-password"
		minlength={6}
		maxlength={20}
		bind:value={confirm_password}
		required
	/>

	{#if !passwords_confirmed}
		<p>Please make sure passwords match!</p>
	{/if}

	<FormInput type="email" label="Email" name="email" bind:value={email} required />
	<FormInput
		type="email"
		label="Repeat Email"
		name="confirm-email"
		bind:value={confirm_email}
		required
	/>

	{#if !emails_confirmed}
		<p>Please make sure emails match!</p>
	{/if}

	<FormInput
		type="submit"
		value="Register"
		disabled={!passwords_confirmed || !emails_confirmed || !password || !email}
	/>
</form>
