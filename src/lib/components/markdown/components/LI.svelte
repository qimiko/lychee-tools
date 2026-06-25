<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	const { children, ...rest }: HTMLAttributes<HTMLLIElement> = $props();
</script>

<li {...rest}>
	{@render children?.()}
</li>
