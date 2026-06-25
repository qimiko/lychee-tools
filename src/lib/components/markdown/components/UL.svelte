<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	const { children, ...rest }: HTMLAttributes<HTMLUListElement> = $props();
</script>

<ul {...rest}>
	{@render children?.()}
</ul>

<style>
	ul {
		padding: 0 2em;
		margin: 1em auto;
		max-width: 70ch;

		text-align: left;
	}
</style>
