<script lang="ts">
	import type { HTMLAnchorAttributes } from 'svelte/elements';

	let { children, ...rest }: HTMLAnchorAttributes = $props();
</script>

<a {...rest}>{@render children?.()}</a>

<style>
	a {
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
		transition: all 0.5s;
	}

	a:hover {
		box-shadow: #aaa 0 1px 15px;
		background-image: radial-gradient(100% 100% at 100% 0, #7f73ee 0, #9362ee 100%);
		transition-duration: 0.1s;
	}

	a:active {
		background-image: radial-gradient(100% 100% at 100% 0, #9362ee 0, #7f73ee 100%);
	}
</style>
