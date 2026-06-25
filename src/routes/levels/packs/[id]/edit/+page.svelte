<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ServerMapPack } from '$lib/api';
	import MapPackCell from '$lib/components/cells/MapPackCell.svelte';
	import Button from '$lib/components/core/Button.svelte';
	import FormInput from '$lib/components/core/FormInput.svelte';
	import Title from '$lib/components/core/Title.svelte';

	let { form, data } = $props();

	let name = $derived(form?.name ?? data.pack.name);
	let coins = $derived(form?.coins ?? data.pack.coins.toString());
	let stars = $derived(form?.stars ?? data.pack.stars.toString());
	let difficulty = $derived(parseInt(form?.difficulty ?? data.pack.difficulty.toString()));
	let levels = $derived(form?.levels ?? data.pack.levels.join(','));
	let color = $derived(form?.color ?? '#' + data.pack.text_color.toString(16));

	function parse_levels(x: string) {
		return x.split(',').flatMap((l) => (+l ? [+l] : []));
	}

	function parse_color(x: string) {
		return parseInt(x.substring(1), 16);
	}

	const pack_object = $derived<ServerMapPack>({
		name: name ? name : '???? Pack',
		coins: +coins,
		stars: +stars,
		levels: parse_levels(levels),
		bar_color: parse_color(color),
		text_color: parse_color(color),
		difficulty: difficulty,
		id: 0
	});
</script>

<svelte:head>
	<title>Edit Map Pack - 1.9 GDPS</title>
	<meta name="og:site_name" content="1.9 GDPS" />
	<meta name="og:title" content="Edit Map Pack" />
</svelte:head>

<Title>Edit Map Pack</Title>

Currently editing <b>{data.pack.name}</b>.

<form method="POST" use:enhance>
	{#if form?.error}
		<p>{form.error}</p>
	{:else if form?.success}
		<p>Pack edited!</p>
	{/if}

	<FormInput type="text" label="Name" bind:value={name} name="name" />
	<FormInput
		type="text"
		label="Levels"
		bind:value={levels}
		placeholder="IDs separated by commas"
		name="levels"
	/>
	<FormInput type="number" label="Stars" bind:value={stars} name="stars" min={0} />
	<FormInput type="number" label="Coins" bind:value={coins} name="coins" min={0} />

	<label>
		Difficulty:

		<select name="difficulty" bind:value={difficulty}>
			<option value={0}>Auto</option>
			<option value={1}>Easy</option>
			<option value={2}>Normal</option>
			<option value={3}>Hard</option>
			<option value={4}>Harder</option>
			<option value={5}>Insane</option>
			<option value={6}>Demon</option>
		</select>
	</label>

	<FormInput type="color" label="Color" bind:value={color} name="color" />

	<div>
		<Button type="submit">Edit</Button>
	</div>
</form>

<div class="cell-container">
	<MapPackCell pack={pack_object} />
</div>

<style>
	.cell-container {
		display: flex;
		justify-content: center;
		padding: 1em 0;
	}
</style>
