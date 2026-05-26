<script lang="ts">
	import Title from '$lib/components/core/Title.svelte';
	import type { PageData } from './$types.js';
	import logo from '$lib/assets/ogp-icon.png';
	import UserCell from '$lib/components/cells/UserCell.svelte';
	import StarIcon from '$lib/assets/icons/star_big.png';
	import DemonIcon from '$lib/assets/icons/demon.png';
	import CoinIcon from '$lib/assets/icons/coin.png';
	import PointsIcon from '$lib/assets/icons/points.png';
	import { resolve } from '$app/paths';
	import { goto } from '$app/navigation';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let type = $derived(data.type ?? 'stars');
	let time = $derived(data.time ?? 'global');

	async function updateQueryParams() {
		const params = new URLSearchParams();
		params.set('type', type);
		params.set('time', time);

		await goto(`${resolve('/leaderboards')}?${params}`, {
			noScroll: true,
			keepFocus: true,
			replaceState: true
		});
	}
</script>

<svelte:head>
	<title>Leaderboards - 1.9 GDPS</title>
	<meta name="og:title" content="1.9 GDPS" />
	<meta name="og:image" content={logo} />
</svelte:head>

<Title>Leaderboards</Title>

<div class="filters">
	<div class="stats-select">
		<div class="stats-row">
			<input type="radio" value="stars" bind:group={type} onchange={() => updateQueryParams()} />
			<img src={StarIcon} alt="star" />
		</div>

		<div class="stats-row">
			<input type="radio" value="demons" bind:group={type} onchange={() => updateQueryParams()} />
			<img src={DemonIcon} alt="demon" />
		</div>

		<div class="stats-row">
			<input
				type="radio"
				value="secret_coins"
				bind:group={type}
				onchange={() => updateQueryParams()}
			/>
			<img src={CoinIcon} alt="coins" />
		</div>

		<div class="stats-row">
			<input
				type="radio"
				value="creator_points"
				bind:group={type}
				onchange={() => updateQueryParams()}
			/>
			<img src={PointsIcon} alt="points" />
		</div>
	</div>

	{#if type != 'creator_points'}
		<div>
			<input type="radio" value="global" bind:group={time} onchange={() => updateQueryParams()} />
			Global

			<input type="radio" value="daily" bind:group={time} onchange={() => updateQueryParams()} />
			24h

			<input type="radio" value="weekly" bind:group={time} onchange={() => updateQueryParams()} />
			Week
		</div>
	{/if}
</div>

{#if data.users.length == 0}
	<div>No users found!</div>
{:else}
	<div class="center">
		<div class="level-row">
			{#each data.users as user (user.id)}
				<UserCell {user} />
			{/each}
		</div>
	</div>
{/if}

<style>
	.center {
		display: flex;
		justify-content: center;
		width: 100%;
	}

	.level-row {
		display: flex;
		flex-direction: column;

		row-gap: 1em;
	}

	.stats-select {
		display: flex;
		gap: 1em;
	}

	.stats-row {
		display: flex;
		align-items: center;

		gap: 0.25em;
	}

	.stats-select img {
		height: 2em;
	}

	.filters {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-left: auto;
		margin-right: auto;

		margin-bottom: 1em;
		flex-wrap: wrap;

		column-gap: 5em;
		row-gap: 1em;
	}
</style>
