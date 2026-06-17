<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';

	let { children, ...rest }: HTMLButtonAttributes = $props();
</script>

<button {...rest}>
	<div class="inner-container">
		{@render children?.()}
	</div>
</button>

<style>
	button {
		background-color: transparent;
		color: black;
		font-size: 20px;
		text-decoration: none;
		border: none;
		transition: all 0.5s;

		display: inline-block;

		padding: 0.5rem;
		border-radius: 16px;
	}

	button:not(:disabled) {
		cursor: pointer;
	}

	.inner-container {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	button:not(:disabled):hover {
		background-color: rgba(0, 0, 0, 0.1);
		transition-duration: 0.1s;
	}

	button:not(:disabled):active {
		background-color: rgba(0, 0, 0, 0.1);
	}

	button:disabled {
		color: #888;
	}
</style>
