<script lang="ts">
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';
	import { type Icon as IconType } from '@lucide/svelte';

	type Props = {
		buttonStyle?: 'primary' | 'emphasis' | 'secondary';
		icon?: typeof IconType;
	} & (HTMLAnchorAttributes | HTMLButtonAttributes);

	let { children, buttonStyle = 'primary', ...rest }: Props = $props();
</script>

<svelte:element
	this={'href' in rest && rest.href ? 'a' : 'button'}
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
</svelte:element>

<style>
	@property --start-color {
		syntax: '<color>';
		inherits: false;
		initial-value: #9362ee;
	}

	@property --end-color {
		syntax: '<color>';
		inherits: false;
		initial-value: #7f73ee;
	}

	.button {
		display: inline-block;
		border-radius: 12px;
		background-color: transparent;
		background-image: radial-gradient(
			100% 100% at 100% 0,
			var(--start-color) 0,
			var(--end-color) 100%
		);
		color: #f2f2f2;
		font-size: 20px;
		padding: 12px;
		cursor: pointer;
		margin: 5px;
		text-decoration: none;
		border: none;
		transition:
			--start-color 0.5s,
			--end-color 0.5s,
			box-shadow 0.5s,
			background-color 0.5s;

		background-blend-mode: multiply;

		font-family: inherit;
	}

	.emphasis {
		--start-color: #ee73c7;
		--end-color: #e062ee;
	}

	.secondary {
		color: black;

		--start-color: #c6a9fa;
		--end-color: #bfb9ff;
	}

	.button:disabled {
		--start-color: #8f8c97;
		--end-color: #7b7988;
	}

	.button:hover:not(:disabled),
	.button:active:not(:disabled),
	.button:focus:not(:disabled) {
		box-shadow: 0 1px 8px 0 rgba(0, 0, 0, 0.5);
		transition-duration: 0.1s;

		--start-color: #7f73ee;
		--end-color: #9362ee;
	}

	.button:hover.emphasis:not(:disabled),
	.button:active.emphasis:not(:disabled),
	.button:focus.emphasis:not(:disabled) {
		--start-color: #e062ee;
		--end-color: #ee73c7;
	}

	.button:hover.secondary:not(:disabled),
	.button:active.secondary:not(:disabled),
	.button:focus.secondary:not(:disabled) {
		--start-color: #bfb9ff;
		--end-color: #c6a9fa;
	}

	.button:active:not(:disabled) {
		background-color: #ccc;
	}

	.button-icon {
		display: flex;
		gap: 0.25rem;

		align-items: center;
	}
</style>
