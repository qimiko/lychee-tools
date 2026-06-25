<script lang="ts">
	import type { PageData } from './$types.js';

	import Title from '$lib/components/core/Title.svelte';
	import MapPackCell from '$lib/components/cells/MapPackCell.svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
</script>

<svelte:head>
	<title>Map Packs - 1.9 GDPS</title>
	<meta name="og:site_name" content="1.9 GDPS" />
	<meta name="og:title" content="Map Packs" />
</svelte:head>

<Title>Map Packs</Title>

{#if data.packs.count > 0}
	<div class="packs-container">
		{#each data.packs.items as pack (pack.id)}
			<MapPackCell {pack} showEdit={(data.current_user?.permission_level ?? 0) >= 1} />
		{/each}
	</div>
{:else}
	<div class="packs-container">No packs found!</div>
{/if}

<style>
	.packs-container {
		display: flex;
		flex-direction: row;
		width: 100%;
		align-items: center;
		justify-content: center;

		flex-wrap: wrap;

		gap: 2em;
		margin-bottom: 1em;
	}
</style>
