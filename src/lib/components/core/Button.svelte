<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';

	let { children, ...rest }: HTMLButtonAttributes = $props();
</script>

<button {...rest}>{@render children?.()}</button>

<style>
	button {
		display: inline-block;
		border-radius: 12px;
		background-image: radial-gradient(100% 100% at 100% 0, #9362ee 0, #7f73ee 100%);
		color: #f2f2f2;
		font-size: 20px;
		padding: 12px;
		max-width: 256px;
		cursor: pointer;
		margin: 5px;
		text-decoration: none;
		border: none;
		transition: all 0.5s;

		font-family: inherit;
	}

	button:hover {
		box-shadow: 0 1px 10px 0 rgba(0, 0, 0, 0.6);
		background-image: radial-gradient(100% 100% at 100% 0, #7f73ee 0, #9362ee 100%);
		transition-duration: 0.1s;
	}

	button:active {
		background-image: radial-gradient(100% 100% at 100% 0, #9362ee 0, #7f73ee 100%);
	}
</style>
