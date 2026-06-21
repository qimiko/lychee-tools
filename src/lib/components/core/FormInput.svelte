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
	<p class="form-input">
		<label for={`${id}-textinput`} class="form-label">{label}:</label>

		{#if rest.type == 'checkbox'}
			<input
				class={['input-style', className]}
				id="{id}-textinput"
				type="checkbox"
				{...rest}
				bind:checked
			/>
		{:else}
			<input class={['input-style', className]} id={`${id}-textinput`} {...rest} bind:value />
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

		font-family: inherit;
	}

	.input-style[type='submit']:hover {
		box-shadow: 0 1px 10px 0 rgba(0, 0, 0, 0.6);
		background-image: radial-gradient(100% 100% at 100% 0, #7f73ee 0, #9362ee 100%);
		transition-duration: 0.1s;
	}

	.input-style[type='submit']:not(:disabled):active {
		background-image: radial-gradient(100% 100% at 100% 0, #9362ee 0, #7f73ee 100%);
	}

	.input-style[type='submit']:disabled {
		background-image: radial-gradient(100% 100% at 100% 0, #8f8c97 0, #7b7988 100%);
	}

	.form-input {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: row;
		gap: 0.5em;
	}

	@media screen and (max-width: 450px) {
		.form-input {
			flex-direction: column;
			align-items: start;

			max-width: fit-content;
			margin-left: auto;
			margin-right: auto;

			gap: 0.25em;
		}

		.form-label {
			margin-left: 0.5rem;
		}
	}
</style>
