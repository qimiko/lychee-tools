<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		size?: 1 | 2;
		children: Snippet;
	}

	let { children, size = 1 }: Props = $props();
</script>

{#if size == 1}
	<h1 class="title">{@render children?.()}</h1>
{:else}
	<h2 class="subtitle">{@render children?.()}</h2>
{/if}

<style>
	.title {
		line-height: 72px;
		text-align: center;
		text-transform: uppercase;
		background-image: linear-gradient(to right, #dddddd, #d7d7d7, #dddddd);
		border-bottom: 3px solid #ccc;
		box-shadow: #bbb 0 1px 10px;
	}

	.subtitle {
		line-height: 64px;
		text-align: center;
		text-transform: uppercase;
		background-image: linear-gradient(to right, #dddddd, #d7d7d7, #dddddd);
		border-bottom: 2px solid #ccc;
		box-shadow: #bbb 0 1px 10px;
	}
</style>
