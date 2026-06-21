<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLHeadingElement> {
		size?: 1 | 2;
	}

	let { children, size = 1, ...rest }: Props = $props();
</script>

{#if size == 1}
	<h1 class="title" {...rest}>{@render children?.()}</h1>
{:else}
	<h2 class="subtitle" {...rest}>{@render children?.()}</h2>
{/if}

<style>
	.title {
		line-height: 72px;
		text-align: center;
		background-image: linear-gradient(to right, #dddddd, #d7d7d7, #dddddd);
		border-bottom: 3px solid #ccc;
		box-shadow: 0 1px 10px 0 rgba(0, 0, 0, 0.15);
	}

	.subtitle {
		line-height: 64px;
		text-align: center;
		background-image: linear-gradient(to right, #dddddd, #d7d7d7, #dddddd);
		border-bottom: 2px solid #ccc;
		box-shadow: 0 1px 10px 0 rgba(0, 0, 0, 0.15);
	}
</style>
