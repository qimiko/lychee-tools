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
