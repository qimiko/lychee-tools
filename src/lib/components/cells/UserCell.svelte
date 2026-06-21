<script lang="ts">
	import type { ServerUser } from '$lib/api';
	import PlayerIcon from '../render/PlayerIcon.svelte';
	import StarIcon from '$lib/assets/icons/star_big.png';
	import DemonIcon from '$lib/assets/icons/demon.png';
	import CoinIcon from '$lib/assets/icons/coin.png';
	import PointsIcon from '$lib/assets/icons/points.png';
	import ModBadge from '$lib/assets/badges/mod.png';
	import AdminBadge from '$lib/assets/badges/admin.png';

	import { formatNumber, iconTypeToString } from '$lib';
	import Link from '../core/Link.svelte';
	import { resolve } from '$app/paths';

	interface Props {
		user: ServerUser;
		firstStat?: 'stars' | 'demons' | 'secret_coins' | 'creator_points';
	}

	const { user, firstStat = 'stars' }: Props = $props();
	const statOrder = $derived.by(() => {
		switch (firstStat) {
			case 'stars':
				return ['stars', 'demons', 'creator_points', 'secret_coins'];
			case 'demons':
				return ['demons', 'stars', 'creator_points', 'secret_coins'];
			case 'creator_points':
				return ['creator_points', 'stars', 'demons', 'secret_coins'];
			case 'secret_coins':
				return ['secret_coins', 'stars', 'creator_points', 'demons'];
		}
	});

	const icon_type = $derived(iconTypeToString(user.icon_type));
</script>

<div class="cell">
	{#if user.rank}
		#{user.rank}
	{/if}

	<div class="icon-container">
		<PlayerIcon
			icon={user.icon}
			color1={user.color}
			color2={user.color2}
			glow={user.special == 2}
			iconType={icon_type}
			maxHeight="3rem"
			maxWidth="100%"
		/>
	</div>

	<div class="primary-container">
		<div class="name-container">
			<Link
				href={resolve('/users/[id]', {
					id: user.id.toString()
				})}
			>
				{user.name}
			</Link>

			{#if user.permission_level && user.permission_level > 1}
				<img src={AdminBadge} alt="admin" class="stats-icon" />
			{:else if user.permission_level && user.permission_level > 0}
				<img src={ModBadge} alt="mod" class="stats-icon" />
			{/if}
		</div>

		<div class="stats-row">
			{#each statOrder as stat (stat)}
				{#if stat == 'stars'}
					<div class="stats-item" class:small={user.stars > 100000}>
						{formatNumber(user.stars)}
						<img src={StarIcon} alt="stars" class="stats-icon" />
					</div>
				{:else if stat == 'demons'}
					<div class="stats-item" class:small={user.demons > 10000}>
						{formatNumber(user.demons)}
						<img src={DemonIcon} alt="demons" class="stats-icon" />
					</div>
				{:else if stat == 'secret_coins'}
					<div class="stats-item" class:small={user.coins > 1000}>
						{formatNumber(user.coins)}
						<img src={CoinIcon} alt="demons" class="stats-icon" />
					</div>
				{:else if stat == 'creator_points'}
					{#if user.creator_points > 0}
						<div class="stats-item" class:small={user.creator_points > 1000}>
							{formatNumber(user.creator_points)}
							<img src={PointsIcon} alt="demons" class="stats-icon" />
						</div>
					{:else}
						<div class="spacer"></div>
					{/if}
				{/if}
			{/each}
		</div>
	</div>
</div>

<style>
	.cell {
		display: flex;

		max-width: 35rem;

		background-color: rgba(0, 0, 0, 0.05);
		border-radius: 16px;
		padding: 1em 1em 1em 1em;

		box-shadow: #bbb 0 1px 10px;

		column-gap: 1em;
		align-items: center;
	}

	.icon-container {
		width: 6rem;
		height: auto;
	}

	.cell:hover {
		background-color: rgba(0, 0, 0, 0.1);
	}

	.name-container {
		display: flex;
		gap: 0.5em;
		align-items: center;

		flex-grow: 1;
	}

	.primary-container {
		display: flex;
		flex-direction: row;
		column-gap: 3em;

		align-items: center;

		flex-grow: 1;
	}

	.stats-icon {
		height: 1.5em;
	}

	.stats-row {
		margin-left: auto;
		display: grid;
		grid-template-columns: auto auto;
		column-gap: 0.75em;
		row-gap: 0.25em;
	}

	.small {
		font-size: small;
	}

	@media screen and (max-width: 512px) {
		.primary-container {
			flex-direction: column;
			align-items: start;

			row-gap: 0.5em;
		}

		.icon-container {
			width: 2em;
		}

		.stats-row {
			display: flex;
			flex-direction: row;
			width: 100%;

			justify-content: start;
			align-items: center;
		}

		.spacer {
			display: none;
		}

		.small {
			font-size: x-small;
		}
	}

	.stats-item {
		display: flex;
		column-gap: 0.25em;

		justify-content: end;
		align-items: center;
	}
</style>
