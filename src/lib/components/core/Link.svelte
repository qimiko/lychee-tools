<script lang="ts">
	import type { HTMLAnchorAttributes } from 'svelte/elements';
	import { type Icon as IconType } from '@lucide/svelte';

	interface Props extends HTMLAnchorAttributes {
		icon?: typeof IconType;
	}

	let { children, class: className, ...rest }: Props = $props();
</script>

<a class={['inline-link', className]} {...rest}>
	{#if rest.icon}
		<span class="link-icon">
			<rest.icon size={18} />
			{@render children?.()}
		</span>
	{:else}
		{@render children?.()}
	{/if}
</a>

<style>
	.inline-link {
		display: inline-block;
		text-decoration: none;

		overflow-wrap: break-word;

		color: #0058ff;
	}

	.inline-link:link {
		color: #0058ff;
		background-color: transparent;
	}

	.inline-link:visited {
		color: #0058ff;
		background-color: transparent;
	}

	.inline-link:hover {
		color: #222;
		background-color: transparent;
		text-decoration: underline dashed;
	}

	.link-icon {
		display: flex;
		gap: 0.25rem;

		align-items: center;
	}
</style>
