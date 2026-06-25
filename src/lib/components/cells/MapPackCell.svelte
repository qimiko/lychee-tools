<script lang="ts">
	import type { ServerMapPack } from '$lib/api';

	import StarIcon from '$lib/assets/icons/star_big.png';
	import CoinIcon from '$lib/assets/icons/coin.png';
	import DifficultyIcon from '../render/DifficultyIcon.svelte';
	import { resolve } from '$app/paths';

	import Link from '../core/Link.svelte';

	interface Props {
		pack: ServerMapPack;
		showEdit?: boolean;
	}

	const { pack, showEdit = false }: Props = $props();

	const difficulty = $derived.by(() => {
		switch (pack.difficulty) {
			case 0:
				return 'auto';
			case 1:
				return 'easy';
			case 2:
				return 'normal';
			case 3:
				return 'hard';
			case 4:
				return 'harder';
			case 5:
				return 'insane';
			case 6:
				return 'demon';
			default:
				return 'na';
		}
	});

	const search_params = $derived(
		new URLSearchParams({
			query: pack.levels.join(','),
			type: 'map_pack',
			override_title: pack.name
		})
	);

	const levels = $derived(pack.levels.join(', '));

	const color_hex = $derived(`#${pack.bar_color.toString(16).padStart(6, '0')}`);
</script>

<div class="level-cell">
	<div class="difficulty-icon">
		<DifficultyIcon stars={0} {difficulty} badge="none" />
	</div>

	<div class="info-container">
		<div class="name-container">
			<div
				class="level-name"
				class:small={pack.name.length >= 15 && pack.name.length < 20}
				class:extra-small={pack.name.length >= 20}
			>
				<Link href={resolve('/levels') + `?${search_params}`}>
					{pack.name}
				</Link>
			</div>
		</div>

		{#if levels.length > 0}
			<span class="underline-colored" style:--bar-color={color_hex}>
				{levels}
			</span>
		{/if}

		<div class="stats-container">
			<div class="level-stat">
				<img src={StarIcon} alt="downloads" />
				{pack.stars}
			</div>

			<div class="level-stat">
				<img src={CoinIcon} alt="downloads" />
				{pack.coins}
			</div>

			{#if pack.id != 0 && showEdit}
				<span>
					<Link
						href={resolve('/levels/packs/[id]/edit', {
							id: pack.id.toString()
						})}>Edit</Link
					>
				</span>
			{/if}
		</div>
	</div>
</div>

<style>
	.level-cell {
		display: flex;
		justify-content: space-between;

		height: 5em;

		background-color: rgba(0, 0, 0, 0.05);
		border-radius: 16px;
		padding: 1em 1em 1em 0.5em;

		box-shadow: #bbb 0 1px 10px;
	}

	.level-cell:hover {
		background-color: rgba(0, 0, 0, 0.1);
	}

	.level-stat {
		display: flex;
		align-items: center;

		column-gap: 0.25rem;
	}

	.stats-container {
		display: flex;
		flex-direction: row;
		justify-content: space-evenly;
		align-items: end;

		width: 100%;
	}

	.level-stat img {
		max-height: 1.25rem;
	}

	.level-name {
		font-size: 1.5em;
	}

	.level-name.small {
		font-size: 1.25em;
	}

	.level-name.extra-small {
		font-size: 1.05em;
	}

	.info-container {
		display: flex;
		flex-direction: column;

		justify-content: space-evenly;
		align-items: start;

		flex-grow: 1;
	}

	.name-container {
		display: flex;
		flex-direction: column;
		align-items: start;
		gap: 0.25em;
		text-align: left;
	}

	.difficulty-icon {
		padding-right: 0.5em;
	}

	.underline-colored {
		background-color: var(--bar-color);
		border-radius: 12px;
		margin: 0.25em 0;
		padding: 0.25em;

		color: contrast-color(var(--bar-color));
	}
</style>
