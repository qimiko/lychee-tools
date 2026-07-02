<script>
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import Button from '$lib/components/core/Button.svelte';
	import FormInput from '$lib/components/core/FormInput.svelte';
	import Title from '$lib/components/core/Title.svelte';

	let { form, data } = $props();

	const first_account = $derived(data.accounts[0]?.id);

	const key = $derived(page.url.searchParams.get('k'));
</script>

<svelte:head>
	<title>Password Reset - 1.9 GDPS</title>
	<meta name="og:site_name" content="1.9 GDPS" />
	<meta name="og:title" content="Password Reset" />
</svelte:head>

<Title>Password Reset</Title>

<form method="POST" use:enhance action={`?k=${key}`}>
	{#if form?.error}
		<p>{form.error}</p>
	{/if}

	<input type="hidden" name="key" value={key} />

	<p>Select account:</p>

	{#each data.accounts as account (account.id)}
		<p>
			<label>
				<input
					type="radio"
					name="account"
					value={account.id}
					required
					checked={account.id == first_account}
				/>
				{account.username}
			</label>
		</p>
	{/each}

	<FormInput
		type="password"
		label="Password"
		name="password"
		minlength={6}
		maxlength={20}
		required
	/>

	<div>
		<Button type="submit">Reset</Button>
	</div>
</form>
