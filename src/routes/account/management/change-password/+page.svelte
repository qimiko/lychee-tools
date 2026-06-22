<script>
	import { enhance } from '$app/forms';
	import Button from '$lib/components/core/Button.svelte';
	import FormInput from '$lib/components/core/FormInput.svelte';
	import Title from '$lib/components/core/Title.svelte';

	let { form } = $props();
</script>

<svelte:head>
	<title>Change Password - 1.9 GDPS</title>
	<meta name="og:title" content="1.9 GDPS" />
</svelte:head>

<Title>Change Password</Title>

<form method="POST" use:enhance>
	{#if form?.error}
		<p>{form.error}</p>
	{/if}

	<p>
		Upon changing your password, you will be logged out of all devices. You should "Refresh Login"
		ingame afterwards.
	</p>

	<FormInput type="password" label="Current Password" name="current_password" required />

	<FormInput
		type="password"
		label="New Password"
		name="new_password"
		minlength={6}
		maxlength={20}
		required
	/>

	<div>
		<Button type="submit">Update</Button>
	</div>
</form>
