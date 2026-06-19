<script lang="ts">
	import PlayerIcon from '$lib/components/render/PlayerIcon.svelte';

	import StarIcon from '$lib/assets/icons/star_big.png';
	import DemonIcon from '$lib/assets/icons/demon.png';
	import CoinIcon from '$lib/assets/icons/coin.png';
	import PointsIcon from '$lib/assets/icons/points.png';
	import ModBadge from '$lib/assets/badges/mod.png';
	import AdminBadge from '$lib/assets/badges/admin.png';

	import { formatNumber } from '$lib';
	import type { ServerUser } from '$lib/api';
	import RankIcon from './render/RankIcon.svelte';

	interface Props {
		user: ServerUser;
	}

	const { user }: Props = $props();

	const icon_type = $derived.by(() => {
		switch (user.icon_type) {
			default:
			case 0:
				return 'cube';
			case 1:
				return 'ship';
			case 2:
				return 'ball';
			case 3:
				return 'ufo';
			case 4:
				return 'wave';
		}
	});
</script>

<div class="user-header">
	<div class="icon-container">
		<PlayerIcon
			icon={user.icon}
			color1={user.color}
			color2={user.color2}
			glow={user.special == 2}
			iconType={icon_type}
			maxHeight="4rem"
			maxWidth="100%"
		/>
	</div>

	<div class="user-name">
		{user.name}

		{#if user.permission_level && user.permission_level > 1}
			<img src={AdminBadge} alt="admin" class="player-badge" />
		{:else if user.permission_level && user.permission_level > 0}
			<img src={ModBadge} alt="mod" class="player-badge" />
		{/if}
	</div>
</div>

<div class="stats-row">
	{#if user.global_rank}
		<div class="rank-container">
			<RankIcon rank={user.global_rank} />
			#{user.global_rank}
		</div>
	{/if}

	<div class="stats-item">
		{formatNumber(user.stars)}
		<img src={StarIcon} alt="stars" class="stats-icon" />
	</div>
	<div class="stats-item">
		{formatNumber(user.demons)}
		<img src={DemonIcon} alt="demons" class="stats-icon" />
	</div>
	{#if user.creator_points > 0}
		<div class="stats-item">
			{formatNumber(user.creator_points)}
			<img src={PointsIcon} alt="demons" class="stats-icon" />
		</div>
	{:else}
		<div></div>
	{/if}
	<div class="stats-item">
		{formatNumber(user.coins)}
		<img src={CoinIcon} alt="demons" class="stats-icon" />
	</div>
</div>

<style>
	.user-name {
		font-size: x-large;
		display: flex;
		column-gap: 0.3em;

		align-items: center;
	}

	.stats-row {
		display: flex;
		width: 100%;
		justify-content: center;
		column-gap: 0.75em;

		flex-wrap: wrap;
	}

	.stats-icon {
		height: 2rem;
	}

	.stats-item {
		display: flex;
		align-items: center;
		column-gap: 0.25em;
	}

	.user-header {
		display: flex;
		align-items: center;
		column-gap: 1em;
		justify-content: center;

		padding: 1em 0;
	}

	.rank-container {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.player-badge {
		height: 1.5em;
	}

	.icon-container {
		max-width: 6rem;
	}

	@media screen and (max-width: 600px) {
		.icon-container {
			max-width: 3rem;
		}

		.player-badge {
			height: 1em;
		}

		.user-header {
			column-gap: 0.5em;
		}
	}
</style>
