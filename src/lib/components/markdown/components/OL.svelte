<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	const { children, ...rest }: HTMLAttributes<HTMLOListElement> = $props();
</script>

<ol {...rest}>
	{@render children?.()}
</ol>

<style>
	ol {
		padding: 0 2em;
		margin: 1em auto;
		max-width: 65ch;

		text-align: left;
	}
</style>
