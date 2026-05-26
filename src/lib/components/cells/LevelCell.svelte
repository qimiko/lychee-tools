<script lang="ts">
	import type { ServerLevel } from '$lib/api';

	import DownloadIcon from '$lib/assets/icons/download.png';
	import LikesIcon from '$lib/assets/icons/like.png';
	import NoteIcon from '$lib/assets/icons/note.png';
	import DislikeIcon from '$lib/assets/icons/dislike.png';

	import LengthIcon from '$lib/assets/icons/length.png';
	import HighObjectIcon from '$lib/assets/icons/high_objects.png';
	import CollaborationIcon from '$lib/assets/icons/collaboration.png';

	import DifficultyIcon from '../render/DifficultyIcon.svelte';
	import SongInfo from '$lib/songs.json';
	import { resolve } from '$app/paths';
	import { levelToBadge, levelToDifficulty, formatShortNumber, lengthToString } from '$lib';

	import Link from '../core/Link.svelte';

	interface Props {
		level: ServerLevel;
		type?: 'row' | 'cell';
	}

	const { level, type = 'row' }: Props = $props();

	const revision = $derived(level.revisions[0]);

	const badge = $derived(levelToBadge(level));
	const difficulty = $derived(levelToDifficulty(level));

	const song_name = $derived(
		revision.song
			? revision.song.title
			: (SongInfo[(revision.audio_track + 1).toString() as keyof typeof SongInfo]?.name ??
					'Unknown')
	);

	const song_artist = $derived(
		revision.song
			? revision.song.artist_name
			: (SongInfo[(revision.audio_track + 1).toString() as keyof typeof SongInfo]?.artist ?? 'DJVI')
	);

	// vanilla name length is 20 chars
	const name_max = 20;
	const truncated_name = $derived(
		revision.name.length > name_max ? revision.name.substring(0, name_max) + '...' : revision.name
	);

	const small_threshold = $derived(type == 'cell' ? 12 : 20);

	const song_string = $derived(type == 'cell' ? song_name : `${song_name} by ${song_artist}`);
</script>

<div class="level-cell" class:cell={type == 'cell'}>
	<div class="difficulty-icon">
		<DifficultyIcon stars={level.stars} {difficulty} {badge} />
	</div>

	<div class="info-container" class:cell={type == 'cell'}>
		<div class="name-container" class:cell={type == 'cell'}>
			<div class="level-name" class:small={truncated_name.length > small_threshold}>
				<Link
					href={resolve('/levels/[id]', {
						id: level.id.toString()
					})}
				>
					{truncated_name}

					{#if revision.objects > 100_000}
						<img src={HighObjectIcon} alt="high objects" class="title-badge" />
					{/if}

					{#if revision.original_id}
						<img src={CollaborationIcon} alt="collaboration" class="title-badge" />
					{/if}
				</Link>
			</div>

			<Link
				href={resolve('/users/[id]', {
					id: level.author.id.toString()
				})}>{level.author.name}</Link
			>
		</div>

		<div class="song-container" class:cell={type == 'cell'} class:small={song_string.length > 60}>
			<img src={NoteIcon} alt="note" class="song-icon" />

			<span>{song_string}</span>
		</div>

		<div class="stats-container horizontal" class:cell={type == 'cell'}>
			<div class="level-stat">
				<img src={DownloadIcon} alt="downloads" />
				{formatShortNumber(level.downloads)}
			</div>

			<div class="level-stat">
				{#if level.likes >= 0}
					<img src={LikesIcon} alt="likes" />
				{:else}
					<img src={DislikeIcon} alt="likes" />
				{/if}
				{formatShortNumber(level.likes)}
			</div>

			<div class="level-stat">
				<img src={LengthIcon} alt="length" />
				{lengthToString(revision.length, true)}
			</div>
		</div>
	</div>

	<div class="stats-container" class:cell={type == 'cell'}>
		<div class="level-stat">
			<img src={DownloadIcon} alt="downloads" />
			{formatShortNumber(level.downloads)}
		</div>

		<div class="level-stat">
			{#if level.likes >= 0}
				<img src={LikesIcon} alt="likes" />
			{:else}
				<img src={DislikeIcon} alt="likes" />
			{/if}
			{formatShortNumber(level.likes)}
		</div>

		<div class="level-stat">
			<img src={LengthIcon} alt="length" />
			{lengthToString(revision.length, true)}
		</div>

		{#if type != 'cell'}
			<span class="level-id">
				{level.id}
			</span>
		{/if}
	</div>
</div>

<style>
	.level-cell {
		display: flex;
		justify-content: space-between;

		min-width: 20em;
		max-width: 30em;
		height: 7em;

		background-color: rgba(0, 0, 0, 0.05);
		border-radius: 16px;
		padding: 1em 1em 1em 0.5em;

		box-shadow: #bbb 0 1px 10px;
	}

	.level-cell.cell {
		flex-direction: column;

		min-width: 12em;
		max-width: 12em;
		min-height: 15em;
		max-height: 15em;
		gap: 0.5em;

		padding: 1em;
	}

	.level-cell:hover {
		background-color: rgba(0, 0, 0, 0.1);
	}

	.level-id {
		color: gray;
	}

	.level-stat {
		display: flex;
		align-items: center;

		column-gap: 0.25rem;
	}

	.stats-container {
		display: none;
		flex-direction: column;
		justify-content: space-around;
		align-items: end;

		width: 5em;
	}

	.stats-container.cell {
		flex-direction: row;

		width: 100%;
	}

	.stats-container.horizontal {
		display: flex;
		flex-direction: row;
		width: 100%;
	}

	@media screen and (min-width: 512px) {
		.stats-container.horizontal {
			display: none;
		}

		.stats-container:not(.horizontal) {
			display: flex;
		}
	}

	.song-container {
		overflow-x: clip;
		text-overflow: ellipsis;
		text-align: left;

		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		line-clamp: 2;

		overflow-wrap: break-word;
	}

	.song-container.small {
		font-size: 0.9em;
	}

	.song-container.cell {
		padding-top: 0.25em;
		text-align: center;

		width: 10em;
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

	.song-icon {
		height: 1em;
		margin-bottom: -0.2rem;
	}

	.info-container {
		display: flex;
		flex-direction: column;

		justify-content: space-between;
		align-items: start;

		flex-grow: 1;
	}

	.info-container.cell {
		align-items: center;
	}

	.title-badge {
		height: 0.75em;
		display: inline-block;
	}

	.name-container {
		display: flex;
		flex-direction: column;
		align-items: start;
		gap: 0.25em;
		text-align: left;
	}

	.name-container.cell {
		align-items: center;
		text-align: center;
	}

	.difficulty-icon {
		padding-right: 0.5em;
	}
</style>
