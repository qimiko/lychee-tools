<script>
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import Button from '$lib/components/core/Button.svelte';
	import FormInput from '$lib/components/core/FormInput.svelte';
	import Link from '$lib/components/core/Link.svelte';
	import Title from '$lib/components/core/Title.svelte';

	let { form } = $props();
</script>

<svelte:head>
	<title>Reupload Song - 1.9 GDPS</title>
	<meta name="og:site_name" content="1.9 GDPS" />
	<meta name="og:title" content="Reupload Level" />
</svelte:head>

<Title>Reupload Song</Title>

<form method="POST" use:enhance>
	{#if form?.error}
		<p>{form.error}</p>
	{:else if form?.success}
		<p>
			Success! Song reuploaded with ID <Link href={resolve('/songs')}>{form.reuploaded_id}</Link>.
		</p>
	{/if}

	<b>Direct links</b> or <b>Dropbox/Google Drive links</b> only accepted,
	<b><font size="5">NO YOUTUBE OR DISCORD LINKS</font></b><br />

	<FormInput type="url" label="URL" value={form?.url ?? ''} name="url" required />

	<FormInput
		type="text"
		label="Title"
		placeholder="(Uses filename if blank)"
		value={form?.title ?? ''}
		name="title"
	/>

	<FormInput
		type="text"
		label="Artist"
		placeholder="(Uses Reupload if blank)"
		value={form?.artist ?? ''}
		name="artist"
	/>

	<div>
		<Button type="submit">Reupload</Button>
	</div>
</form>
