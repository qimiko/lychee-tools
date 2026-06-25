<script lang="ts">
	import Link from '$lib/components/core/Link.svelte';
	import type { HTMLAnchorAttributes } from 'svelte/elements';

	const { children, ...rest }: HTMLAnchorAttributes = $props();
</script>

<Link {...rest}>
	{@render children?.()}
</Link>
