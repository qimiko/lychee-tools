<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	const { children, ...rest }: HTMLAttributes<HTMLHeadingElement> = $props();
</script>

<h2 {...rest}>
	{@render children?.()}
</h2>

<style>
	h2 {
		margin: 1em;
		text-decoration: underline;
	}
</style>
