<script>
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import Button from '$lib/components/core/Button.svelte';
	import FormInput from '$lib/components/core/FormInput.svelte';
	import Link from '$lib/components/core/Link.svelte';
	import Title from '$lib/components/core/Title.svelte';

	let { form, data } = $props();

	const search_params = $derived(
		new URLSearchParams({
			type: 'user_levels',
			query: data.current_user?.user?.id?.toString() ?? '0',
			override_title: `Levels by ${data.current_user?.name}`
		})
	);
</script>

<svelte:head>
	<title>Delete Account - 1.9 GDPS</title>
	<meta name="og:site_name" content="1.9 GDPS" />
	<meta name="og:title" content="Delete Account" />
</svelte:head>

<Title>Delete Account</Title>

<form method="POST" use:enhance>
	{#if form?.error}
		<p>{form.error}</p>
	{:else if form?.success}
		<p>
			Success, check your email for further steps. If you do not receive it after 15 minutes, try
			again.
		</p>
	{/if}

	<h3>Important Notes</h3>

	<p class="body">
		Once deleted, your <Link href={resolve('/comments') + `?user=${data.current_user?.user?.id}`}>
			{data.comments_count} comment{data.comments_count == 1 ? '' : 's'}
		</Link> and <Link href={resolve('/levels') + `?${search_params}`}>
			{data.levels_count} level{data.levels_count == 1 ? '' : 's'}
		</Link> will be moved to the Reupload account, and all other information will be removed.
	</p>

	<p class="body">
		For more information, see the <Link href={resolve('/faq') + '#how-do-i-delete-my-account'}
			>FAQ</Link
		>.
	</p>

	<FormInput type="password" label="Password" name="password" required />

	<div>
		<Button type="submit">Request Deletion</Button>
	</div>
</form>

<style>
	p.body {
		padding: 0 1em;
		margin: 1em auto;
		max-width: 70ch;
		text-align: left;
	}
</style>
