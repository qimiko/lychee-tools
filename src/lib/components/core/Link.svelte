<script lang="ts">
	import type { HTMLAnchorAttributes } from 'svelte/elements';

	let { children, class: className, ...rest }: HTMLAnchorAttributes = $props();
</script>

<a class={['inline-link', className]} {...rest}>{@render children?.()}</a>

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
		transform: translateY(-2px);
		transition-duration: 0.1s;
	}

	a:active {
		transform: translateY(2px);
	}

	.inline-link {
		text-decoration: none;

		border-radius: 0;
		background-color: transparent;
		background-image: none;
		color: #aaa;
		font-size: 100%;
		padding: 0;
		margin: 0;
		max-width: none;
		border-bottom: 1px dashed #222;
		width: auto;
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
	}
</style>
