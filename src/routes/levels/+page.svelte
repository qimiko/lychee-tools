<script lang="ts">
	import LevelCell from '$lib/components/cells/LevelCell.svelte';
	import Title from '$lib/components/core/Title.svelte';
	import type { PageData } from './$types.js';
	import logo from '$lib/assets/ogp-icon.png';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import Pagination from '$lib/components/Pagination.svelte';
	import FormInput from '$lib/components/core/FormInput.svelte';
	import IconButton from '$lib/components/core/IconButton.svelte';
	import Search from '@lucide/svelte/icons/search';
	import Funnel from '@lucide/svelte/icons/funnel';

	import AudioTracksList from '$lib/songs.json';
	import Button from '$lib/components/core/Button.svelte';
	import Pusab from '$lib/components/render/Pusab.svelte';
	import { SvelteSet } from 'svelte/reactivity';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let selected_page = $derived(data.params.page ?? 0);
	let query = $derived(data.params.query ?? '');
	let type = $derived(data.params.type ?? 'most_downloaded');
	let epic = $derived(data.params.epic ?? false);
	let star = $derived(data.params.star ?? false);
	let no_star = $derived(data.params.no_stars ?? false);
	let count = $derived(data.params.count ?? 25);
	let no_points = $derived(data.params.no_points ?? false);
	let no_reupload = $derived(data.params.no_reupload ?? false);
	let two_player = $derived(data.params.two_player ?? false);
	let original = $derived(data.params.original ?? false);
	let custom_song = $derived(data.params.custom_song ?? false);
	let featured = $derived(data.params.featured ?? false);
	let audio_track = $derived(data.params.audio_track ?? 0);

	const override_title = $derived(page.url.searchParams.get('override_title'));

	let track_input = $derived(data.params.audio_track?.toString() ?? '');

	let show_song_filters = $derived(
		data.params.audio_track !== undefined || data.params.custom_song
	);

	const song_list = Object.entries(AudioTracksList)
		.map(([id, info]) => {
			return [+id, info] as const;
		})
		.filter(([id]) => audio_track == -1 || id != -1)
		.sort(([id_a], [id_b]) => id_a - id_b);

	const selected_difficulties = $derived(new SvelteSet(data.params.diffs));
	const selected_lengths = $derived(new SvelteSet(data.params.lengths));

	async function updateQueryParams() {
		// eslint-disable-next-line svelte/prefer-svelte-reactivity
		const params = new URLSearchParams();
		params.set('page', selected_page.toString());
		params.set('count', count.toString());
		params.set('type', type);

		if (query) {
			params.set('query', query);
		}

		if (epic) {
			params.set('epic', 'true');
		}

		if (star) {
			params.set('star', 'true');
		}

		if (no_points) {
			params.set('no_points', 'true');
		}

		if (no_reupload) {
			params.set('no_reupload', 'true');
		}

		if (no_star) {
			params.set('no_star', 'true');
		}

		if (two_player) {
			params.set('two_player', 'true');
		}

		if (original) {
			params.set('original', 'true');
		}

		if (custom_song) {
			params.set('custom_song', 'true');
		}

		if (featured) {
			params.set('featured', 'true');
		}

		if (show_song_filters && audio_track) {
			params.set('audio_track', audio_track.toString());
		}

		if (selected_lengths.size != 0) {
			for (const item of selected_lengths) {
				params.append('length', item.toString());
			}
		}

		if (selected_difficulties.size != 0) {
			for (const item of selected_difficulties) {
				params.append('diff', item.toString());
			}
		}

		if (override_title) {
			params.set('override_title', override_title);
		}

		// eslint-disable-next-line svelte/no-navigation-without-resolve
		await goto(`${resolve('/levels')}?${params}`, {
			noScroll: true,
			keepFocus: true,
			replaceState: true
		});
	}

	async function onSearch(e?: Event) {
		selected_page = 0;

		e?.preventDefault();
		updateQueryParams();
	}

	async function updateAudioTrack(e: Event) {
		const parsed_input = +track_input;
		if (!parsed_input) {
			audio_track = 0;
		} else {
			audio_track = parsed_input;
		}

		onSearch(e);
	}

	async function toggleCustomSong(e: Event) {
		if (!custom_song) {
			audio_track = 1;
		} else {
			audio_track = 0;
			track_input = '';
		}

		onSearch(e);
	}

	function toggleLength(length: number) {
		if (selected_lengths.has(length)) {
			selected_lengths.delete(length);
		} else {
			selected_lengths.add(length);
		}

		onSearch(undefined);
	}

	function toggleDifficulty(difficulty: number) {
		if (selected_difficulties.has(difficulty)) {
			selected_difficulties.delete(difficulty);
		} else {
			if (difficulty < 0 || [...selected_difficulties].some((c) => c < 0)) {
				selected_difficulties.clear();
			}

			selected_difficulties.add(difficulty);
		}

		onSearch(undefined);
	}

	let filters_open = $state(false);

	function resetFilters() {
		no_points = false;
		no_reupload = false;
		two_player = false;
		epic = false;
		no_star = false;
		star = false;
		featured = false;
		original = false;
		audio_track = 0;
		custom_song = false;

		selected_difficulties.clear();
		selected_lengths.clear();

		onSearch();
	}
</script>

<svelte:head>
	<title>Search Levels - 1.9 GDPS</title>
	<meta name="og:title" content="1.9 GDPS" />
	<meta name="og:image" content={logo} />
</svelte:head>

<Title>
	{#if override_title}
		{override_title}
	{:else}
		Search Levels
	{/if}
</Title>

{#if !override_title}
	<form onsubmit={onSearch}>
		<div class="search-row">
			<FormInput placeholder="Query" type="text" bind:value={query} />
			<IconButton type="submit">
				<Search />
			</IconButton>
		</div>
	</form>

	<div class="sort-row">
		Search by:
		<select bind:value={type} onchange={onSearch}>
			{#if data.params.type == 'search_string'}
				<option value="search_string">Most Relevant</option>
			{/if}
			<option value="most_downloaded">Most Downloaded</option>
			<option value="most_liked">Most Liked</option>
			<option value="trending">Trending</option>
			<option value="recent">Recent</option>
			{#if data.params.type == 'user_levels'}
				<option value="user_levels">User Levels</option>
			{/if}
			<option value="featured">Featured</option>
			<option value="magic">Magic</option>
			{#if data.params.type == 'map_pack'}
				<option value="map_pack">Map Pack</option>
			{/if}
			<option value="awarded">Awarded</option>
			{#if data.params.type == 'followed'}
				<option value="followed">Followed</option>
			{/if}
			{#if data.params.type == 'friends'}
				<option value="friends">Friends</option>
			{/if}
			<option value="super">Super</option>
			{#if data.params.type == 'reported'}
				<option value="reported">Reported</option>
			{/if}
			{#if data.params.type == 'list'}
				<option value="list">List</option>
			{/if}
			{#if data.params.type == 'sent'}
				<option value="sent">Sent</option>
			{/if}
			{#if data.params.type == 'self_unlisted'}
				<option value="self_unlisted">Unlisted</option>
			{/if}
		</select>

		<IconButton onclick={() => (filters_open = !filters_open)} class={{ active: filters_open }}>
			<Funnel />
		</IconButton>
	</div>
{/if}

{#if filters_open}
	<div class="advanced-filters">
		<span class="filters-header">Advanced Filters</span>

		<div class="basic-filters">
			<label>
				<input type="checkbox" bind:checked={original} onchange={onSearch} />
				Original
			</label>

			<label>
				<input type="checkbox" bind:checked={two_player} onchange={onSearch} />
				Two-Player
			</label>

			<label>
				<input type="checkbox" bind:checked={no_star} onchange={onSearch} disabled={star} />
				Unrated
			</label>

			<label>
				<input type="checkbox" bind:checked={star} onchange={onSearch} disabled={no_star} />
				Rated
			</label>

			<label>
				<input type="checkbox" bind:checked={featured} onchange={onSearch} />
				Featured
			</label>

			<label>
				<input type="checkbox" bind:checked={epic} onchange={onSearch} />
				Super
			</label>

			<label>
				<input type="checkbox" bind:checked={no_points} onchange={onSearch} />
				No Creator Points
			</label>

			<label>
				<input type="checkbox" bind:checked={no_reupload} onchange={onSearch} />
				Non-Reupload
			</label>

			<label>
				<input type="checkbox" bind:checked={show_song_filters} onchange={onSearch} />
				Song
			</label>

			{#if show_song_filters}
				<label>
					<input type="checkbox" bind:checked={custom_song} onchange={toggleCustomSong} />
					Custom Song
				</label>

				{#if !custom_song}
					<select bind:value={audio_track} onchange={onSearch}>
						<option value={0} disabled>None</option>

						{#each song_list as track (track[0])}
							<option value={track[0]}>{track[1].name}</option>
						{/each}
					</select>
				{/if}
			{/if}
		</div>

		{#if show_song_filters}
			<div>
				{#if custom_song}
					<FormInput type="text" placeholder="Song ID" bind:value={track_input} />

					<Button onclick={updateAudioTrack}>Select</Button>
				{/if}
			</div>
		{/if}

		<div class="selection-row">
			<IconButton
				class={{ 'icon-unchecked': !selected_difficulties.has(-1) }}
				onclick={() => toggleDifficulty(-1)}
			>
				<enhanced:img
					src="$lib/assets/difficulty/difficulty_00_btn_001.png"
					alt="NA"
					class="difficulty-icon"
				/>
			</IconButton>
			<IconButton
				class={{ 'icon-unchecked': !selected_difficulties.has(-3) }}
				onclick={() => toggleDifficulty(-3)}
			>
				<enhanced:img
					src="$lib/assets/difficulty/difficulty_auto_btn_001.png"
					alt="Auto"
					class="difficulty-icon"
				/>
			</IconButton>
			<IconButton
				class={{ 'icon-unchecked': !selected_difficulties.has(1) }}
				onclick={() => toggleDifficulty(1)}
			>
				<enhanced:img
					src="$lib/assets/difficulty/difficulty_01_btn_001.png"
					alt="Easy"
					class="difficulty-icon"
				/>
			</IconButton>
			<IconButton
				class={{ 'icon-unchecked': !selected_difficulties.has(2) }}
				onclick={() => toggleDifficulty(2)}
			>
				<enhanced:img
					src="$lib/assets/difficulty/difficulty_02_btn_001.png"
					alt="Normal"
					class="difficulty-icon"
				/>
			</IconButton>
			<IconButton
				class={{ 'icon-unchecked': !selected_difficulties.has(3) }}
				onclick={() => toggleDifficulty(3)}
			>
				<enhanced:img
					src="$lib/assets/difficulty/difficulty_03_btn_001.png"
					alt="Hard"
					class="difficulty-icon"
				/>
			</IconButton>
			<IconButton
				class={{ 'icon-unchecked': !selected_difficulties.has(4) }}
				onclick={() => toggleDifficulty(4)}
			>
				<enhanced:img
					src="$lib/assets/difficulty/difficulty_04_btn_001.png"
					alt="Harder"
					class="difficulty-icon"
				/>
			</IconButton>
			<IconButton
				class={{ 'icon-unchecked': !selected_difficulties.has(5) }}
				onclick={() => toggleDifficulty(5)}
			>
				<enhanced:img
					src="$lib/assets/difficulty/difficulty_05_btn_001.png"
					alt="Insane"
					class="difficulty-icon"
				/>
			</IconButton>
			<IconButton
				class={{ 'icon-unchecked': !selected_difficulties.has(-2) }}
				onclick={() => toggleDifficulty(-2)}
			>
				<enhanced:img
					src="$lib/assets/difficulty/difficulty_06_btn_001.png"
					alt="Demon"
					class="difficulty-icon"
				/>
			</IconButton>
		</div>

		<div class="selection-row">
			<IconButton
				class={{ 'icon-unchecked': !selected_lengths.has(0) }}
				onclick={() => toggleLength(0)}
			>
				<Pusab text="Tiny" maxHeight="1.5rem" />
			</IconButton>

			<IconButton
				class={{ 'icon-unchecked': !selected_lengths.has(1) }}
				onclick={() => toggleLength(1)}
			>
				<Pusab text="Short" maxHeight="1.5rem" />
			</IconButton>

			<IconButton
				class={{ 'icon-unchecked': !selected_lengths.has(2) }}
				onclick={() => toggleLength(2)}
			>
				<Pusab text="Medium" maxHeight="1.5rem" />
			</IconButton>

			<IconButton
				class={{ 'icon-unchecked': !selected_lengths.has(3) }}
				onclick={() => toggleLength(3)}
			>
				<Pusab text="Long" maxHeight="1.5rem" />
			</IconButton>

			<IconButton
				class={{ 'icon-unchecked': !selected_lengths.has(4) }}
				onclick={() => toggleLength(4)}
			>
				<Pusab text="Extra-Long" maxHeight="1.5rem" />
			</IconButton>
		</div>

		<Button onclick={resetFilters}>Clear Filters</Button>
	</div>
{/if}

<Pagination
	count={data.levels.count}
	pageCount={data.levels.items.length}
	perPage={data.params.count ?? 25}
	page={data.params.page ?? 0}
	pluralName="levels"
	singularName="level"
	onSelect={async (x) => {
		selected_page = x;
		await updateQueryParams();
	}}
/>

<div class="center">
	<div class="level-row">
		{#each data.levels.items as level (level.id)}
			<LevelCell {level} />
		{/each}
	</div>
</div>

<Pagination
	count={data.levels.count}
	pageCount={data.levels.items.length}
	perPage={data.params.count ?? 25}
	page={data.params.page ?? 0}
	pluralName="levels"
	singularName="level"
	onSelect={async (x) => {
		selected_page = x;
		await updateQueryParams();
	}}
/>

<style>
	.level-row {
		display: flex;
		flex-direction: column;

		row-gap: 1em;
	}

	.center {
		width: 100%;
		display: flex;
		justify-content: center;
	}

	.search-row {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5em;
	}

	.advanced-filters {
		display: flex;
		flex-direction: column;

		align-items: center;
		gap: 1em;

		background-color: rgba(0, 0, 0, 0.05);
		border-radius: 16px;
		padding: 1em 1em 1em 0.5em;

		box-shadow: #bbb 0 1px 10px;

		width: max-content;
		margin: 1em auto;

		max-width: 95vw;
	}

	.basic-filters {
		display: grid;
		grid-template-columns: repeat(3, 1fr);

		gap: 1em;
	}

	@media screen and (max-width: 600px) {
		.basic-filters {
			grid-template-columns: repeat(2, 1fr);
			font-size: small;
		}
	}

	.filters-header {
		font-weight: 600;
	}

	.sort-row {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0.5em;
	}

	.selection-row {
		display: flex;
		align-items: center;
		flex-wrap: wrap;

		justify-content: center;

		gap: 0.5em;
	}

	.difficulty-icon {
		height: 3em;
		width: auto;
	}

	.selection-row :global(.icon-unchecked) {
		filter: grayscale(1) brightness(0.9);
	}

	.sort-row :global(.active) {
		border: solid rgba(0, 0, 0, 0.75) 1px;
		background-color: rgba(0, 0, 0, 0.1);
	}
</style>
