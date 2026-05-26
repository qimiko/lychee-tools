<script>
	import { enhance } from '$app/forms';
	import FormInput from '$lib/components/core/FormInput.svelte';
	import Title from '$lib/components/core/Title.svelte';

	let { form } = $props();
</script>

<svelte:head>
	<title>Change Username - 1.9 GDPS</title>
	<meta name="og:title" content="1.9 GDPS" />
</svelte:head>

<Title>Change Username</Title>

<form method="POST" use:enhance>
	{#if form?.error}
		<p>{form.error}</p>
	{:else if form?.success}
		<p>
			Success! Your username has been updated. Please "Refresh Login" ingame to have it update
			fully.
		</p>
	{/if}

	<FormInput
		type="text"
		label="New Username"
		name="username"
		minlength={3}
		maxlength={20}
		required
	/>

	<FormInput type="password" label="Password" name="password" required />

	<div>
		<FormInput type="submit" value="Update" />
	</div>
</form>
