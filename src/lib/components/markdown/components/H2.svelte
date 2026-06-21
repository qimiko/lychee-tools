<script lang="ts">
	import Title from '../../core/Title.svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	const { children, ...rest }: HTMLAttributes<HTMLHeadingElement> = $props();
</script>

<Title size={2} {...rest}>
	{@render children?.()}
</Title>
