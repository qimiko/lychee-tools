<script>
	import { enhance } from '$app/forms';
	import FormInput from '$lib/components/core/FormInput.svelte';
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
		<p>Success! Song reupload with ID {form.reuploaded_id}</p>
	{/if}

	<b>Direct links</b> or <b>Dropbox links</b> only accepted,
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
		<FormInput type="submit" value="Reupload" />
	</div>
</form>
