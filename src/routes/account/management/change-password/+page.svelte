<script>
	import { enhance } from '$app/forms';
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
	{:else if form?.success}
		<p>
			Success! Your password has been updated. Please "Refresh Login" ingame to have it update
			fully.
		</p>
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
		<FormInput type="submit" value="Update" />
	</div>
</form>
