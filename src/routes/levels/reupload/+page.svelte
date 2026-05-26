<script>
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import FormInput from '$lib/components/core/FormInput.svelte';
	import Link from '$lib/components/core/Link.svelte';
	import Title from '$lib/components/core/Title.svelte';

	let { form } = $props();
</script>

<svelte:head>
	<title>Reupload Level - 1.9 GDPS</title>
	<meta name="og:site_name" content="1.9 GDPS" />
	<meta name="og:title" content="Reupload Level" />
</svelte:head>

<Title>Reupload Level</Title>

<form method="POST" use:enhance>
	{#if form?.error}
		<p>{form.error}</p>
	{:else if form?.success}
		<p>
			Success! Level reupload to: <Link
				href={resolve('/levels/[id]', {
					id: form.reuploaded_id.toString()
				})}>{form.reuploaded_id}</Link
			>
		</p>
	{/if}

	<FormInput
		type="text"
		inputmode="numeric"
		label="Level ID"
		name="level"
		value={form?.level ?? ''}
		step="1"
		required
	/>

	<FormInput
		type="url"
		label="URL"
		value={form?.url ?? 'https://www.boomlings.com/database/downloadGJLevel22.php'}
		name="url"
		required
	/>

	<div>
		<FormInput type="submit" value="Reupload" />
	</div>
</form>
