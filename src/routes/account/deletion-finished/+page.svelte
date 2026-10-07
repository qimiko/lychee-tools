<script>
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import Button from '$lib/components/core/Button.svelte';
	import Link from '$lib/components/core/Link.svelte';
	import Title from '$lib/components/core/Title.svelte';
</script>

<svelte:head>
	<title>Delete Account - 1.9 GDPS</title>
	<meta name="og:site_name" content="1.9 GDPS" />
	<meta name="og:title" content="Delete Account" />
</svelte:head>

<Title>Delete Account</Title>

<p class="body">
	Your 1.9 GDPS account has been scheduled for deletion in two weeks.

	<br />

	Until then, deletion can be cancelled by logging back into the account.
</p>

<p class="body">
	For more information, see the <Link href={resolve('/faq') + '#how-do-i-delete-my-account'}
		>FAQ</Link
	>.
</p>

<Button onclick={() => goto(resolve('/'))}>1.9 GDPS Home</Button>

<style>
	p.body {
		padding: 0 1em;
		margin: 1em auto;
		max-width: 70ch;
		text-align: left;
	}
</style>
