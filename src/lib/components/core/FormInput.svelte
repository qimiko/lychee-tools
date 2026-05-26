<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	interface Props extends HTMLInputAttributes {
		label?: string;
		placeholder?: string;
		value?: string;
		checked?: boolean;
	}

	const id = $props.id();

	let {
		class: className,
		label,
		value = $bindable(),
		checked = $bindable(),
		...rest
	}: Props = $props();
</script>

{#if label}
	<p>
		<label for="{id}-textinput">{label}:</label>

		{#if rest.type == 'checkbox'}
			<input
				class={['input-style', className]}
				id="{id}-textinput"
				type="checkbox"
				{...rest}
				bind:checked
			/>
		{:else}
			<input class={['input-style', className]} id="{id}-textinput" {...rest} bind:value />
		{/if}
	</p>
{:else}
	<input class={['input-style', className]} {...rest} bind:value />
{/if}

<style>
	.input-style[type='text'],
	.input-style[type='password'],
	.input-style[type='email'],
	.input-style[type='url'] {
		border: none;
		border-radius: 12px;
		background-image: radial-gradient(100% 100% at 100% 0, #dddddd 0, #c7c7c7 100%);
		color: #222;
		font-size: 20px;
		padding: 12px;
		margin: 5px;
		text-decoration: none;
	}

	.input-style[type='submit'] {
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
	}

	.input-style[type='submit']:hover {
		box-shadow: #aaa 0 1px 15px;
		transform: translateY(-2px);
		transition-duration: 0.1s;
	}

	.input-style[type='submit']:not(:disabled):active {
		transform: translateY(2px);
	}

	.input-style[type='submit']:disabled {
		background-image: radial-gradient(100% 100% at 100% 0, #8f8c97 0, #7b7988 100%);
	}
</style>
