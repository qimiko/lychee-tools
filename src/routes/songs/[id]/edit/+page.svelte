<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/core/Button.svelte';
	import FormInput from '$lib/components/core/FormInput.svelte';
	import Title from '$lib/components/core/Title.svelte';

	let { form, data } = $props();

	let name = $derived(form?.name ?? data.song.title);
	let artist = $derived(form?.artist ?? data.song.artist_name);
	let download = $derived(form?.download ?? data.song.download);
</script>

<svelte:head>
	<title>Edit Song - 1.9 GDPS</title>
	<meta name="og:site_name" content="1.9 GDPS" />
	<meta name="og:title" content="Edit Song" />
</svelte:head>

<Title>Edit Song</Title>

Currently editing <b>{data.song.title}</b> ({data.song.id}).

<form method="POST" use:enhance>
	{#if form?.error}
		<p>{form.error}</p>
	{:else if form?.success}
		<p>Song edited!</p>
	{/if}

	<FormInput type="text" label="Name" bind:value={name} name="name" />
	<FormInput type="text" label="Artist" bind:value={artist} name="artist" />
	<FormInput type="text" label="Download" bind:value={download} name="download" />

	<div>
		<Button type="submit">Edit</Button>
	</div>
</form>
