<script lang="ts">
	/* eslint-disable svelte/no-navigation-without-resolve */
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { type Icon as IconType } from '@lucide/svelte';

	interface Props extends HTMLButtonAttributes {
		buttonStyle?: 'primary' | 'emphasis' | 'secondary';
		href?: string;
		icon?: typeof IconType;
	}

	let { children, buttonStyle = 'primary', href, ...rest }: Props = $props();
</script>

{#if href}
	<a
		{href}
		class="button"
		class:emphasis={buttonStyle == 'emphasis'}
		class:secondary={buttonStyle == 'secondary'}
	>
		{#if rest.icon}
			<span class="button-icon">
				<rest.icon />

				{@render children?.()}
			</span>
		{:else}
			{@render children?.()}
		{/if}
	</a>
{:else}
	<button
		{...rest}
		class="button"
		class:emphasis={buttonStyle == 'emphasis'}
		class:secondary={buttonStyle == 'secondary'}
	>
		{#if rest.icon}
			<span class="button-icon">
				<rest.icon />

				{@render children?.()}
			</span>
		{:else}
			{@render children?.()}
		{/if}
	</button>
{/if}

<style>
	.button {
		display: inline-block;
		border-radius: 12px;
		background-image: radial-gradient(100% 100% at 100% 0, #9362ee 0, #7f73ee 100%);
		color: #f2f2f2;
		font-size: 20px;
		padding: 12px;
		cursor: pointer;
		margin: 5px;
		text-decoration: none;
		border: none;
		transition: all 0.5s;

		font-family: inherit;
	}

	.emphasis {
		background-image: radial-gradient(100% 100% at 100% 0, #ee73c7 0, #e062ee 100%);
	}

	.secondary {
		background-image: radial-gradient(100% 100% at 100% 0, #c6a9fa 0, #bfb9ff 100%);
		color: black;
	}

	.button:hover,
	.button:active {
		box-shadow: 0 1px 8px 0 rgba(0, 0, 0, 0.5);
		background-image: radial-gradient(100% 100% at 100% 0, #7f73ee 0, #9362ee 100%);
		transition-duration: 0.1s;
	}

	.button:hover.emphasis,
	.button:active.emphasis {
		background-image: radial-gradient(100% 100% at 100% 0, #e062ee 0, #ee73c7 100%);
	}

	.button:hover.secondary,
	.button:active.secondary {
		background-image: radial-gradient(100% 100% at 100% 0, #bfb9ff 0, #c6a9fa 100%);
	}

	.button-icon {
		display: flex;
		gap: 0.25rem;

		align-items: center;
	}
</style>
