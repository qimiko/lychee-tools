<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	const { children, ...rest }: HTMLAttributes<HTMLParagraphElement> = $props();
</script>

<p {...rest}>
	{@render children?.()}
</p>

<style>
	p {
		padding: 0 1em;
		margin: 1em auto;
		max-width: 70ch;
		text-align: left;
	}
</style>
