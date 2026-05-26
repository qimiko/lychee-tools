<script lang="ts">
	import Pusab from './Pusab.svelte';
	import StarIcon from '$lib/assets/icons/star_big.png';

	import DifficultyNA from '$lib/assets/difficulty/difficulty_00_btn_001.png';
	import DifficultyAuto from '$lib/assets/difficulty/difficulty_auto_btn_001.png';
	import DifficultyEasy from '$lib/assets/difficulty/difficulty_01_btn_001.png';
	import DifficultyNormal from '$lib/assets/difficulty/difficulty_02_btn_001.png';
	import DifficultyHard from '$lib/assets/difficulty/difficulty_03_btn_001.png';
	import DifficultyHarder from '$lib/assets/difficulty/difficulty_04_btn_001.png';
	import DifficultyInsane from '$lib/assets/difficulty/difficulty_05_btn_001.png';
	import DifficultyDemon from '$lib/assets/difficulty/difficulty_06_btn_001.png';

	import BadgeSuper from '$lib/assets/badges/super.png';
	import BadgeFeature from '$lib/assets/badges/feature.png';

	interface Props {
		difficulty: 'na' | 'auto' | 'easy' | 'normal' | 'hard' | 'harder' | 'insane' | 'demon';
		stars: number;
		badge: 'none' | 'feature' | 'epic';
	}

	const { difficulty, stars, badge }: Props = $props();

	const difficulty_assignment = $derived.by(() => {
		switch (difficulty) {
			default:
			case 'na':
				return DifficultyNA;
			case 'auto':
				return DifficultyAuto;
			case 'easy':
				return DifficultyEasy;
			case 'normal':
				return DifficultyNormal;
			case 'hard':
				return DifficultyHard;
			case 'harder':
				return DifficultyHarder;
			case 'insane':
				return DifficultyInsane;
			case 'demon':
				return DifficultyDemon;
		}
	});

	const badge_assignment = $derived.by(() => {
		switch (badge) {
			default:
			case 'none':
				return null;
			case 'feature':
				return BadgeFeature;
			case 'epic':
				return BadgeSuper;
		}
	});
</script>

<div class="base-icon">
	<div class="difficulty-icons">
		{#if badge_assignment != null}
			<img src={badge_assignment} alt={badge} class="badge" />
		{/if}

		<img src={difficulty_assignment} alt={difficulty} class="diff" />
	</div>

	{#if stars > 0}
		<div class="star-row">
			<Pusab text={stars.toString()} maxHeight="1.5em" />
			<img src={StarIcon} alt="stars" class="star-icon" />
		</div>
	{/if}
</div>

<style>
	.base-icon {
		display: flex;
		flex-direction: column;
		align-items: center;

		padding-top: 5px;
	}

	.star-row {
		display: flex;
		align-items: center;

		column-gap: 0.15rem;
	}

	.star-icon {
		max-height: 1.5em;
	}

	.difficulty-icons {
		position: relative;
		width: 80px; /* max: 200px */
		height: calc(0.4 * (270px - 80px)); /* max: 270px -  */
	}

	.difficulty-icons .diff {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%) scale(40%);

		z-index: 1;
	}

	.difficulty-icons .badge {
		position: absolute;
		z-index: 0;

		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%) scale(40%);
	}
</style>
