<script lang="ts">
	import DifficultyIcon from '$lib/components/render/DifficultyIcon.svelte';
	import type { PageData } from './$types.js';
	import SongInfo from '$lib/songs.json';
	import { levelToBadge, levelToDifficulty, formatNumber, lengthToString } from '$lib';
	import CommentCell from '$lib/components/cells/CommentCell.svelte';
	import DownloadIcon from '$lib/assets/icons/download.png';
	import LikesIcon from '$lib/assets/icons/like.png';
	import DislikeIcon from '$lib/assets/icons/dislike.png';
	import LengthIcon from '$lib/assets/icons/length.png';
	import NoteIcon from '$lib/assets/icons/note.png';
	import ObjectIcon from '$lib/assets/icons/object.png';
	import HighObjectIcon from '$lib/assets/icons/high_objects.png';
	import CollaborationIcon from '$lib/assets/icons/collaboration.png';

	import Link from '$lib/components/core/Link.svelte';
	import { resolve } from '$app/paths';
	import Title from '$lib/components/core/Title.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import { goto } from '$app/navigation';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let comments_page = $derived(data.comments_page);
	let sort_type = $derived(data.comments_sort);

	async function updateQueryParams() {
		// eslint-disable-next-line svelte/prefer-svelte-reactivity
		const params = new URLSearchParams();
		params.set('comments_page', comments_page.toString());
		params.set('comments_sort', sort_type);

		await goto(
			// eslint-disable-next-line svelte/no-navigation-without-resolve
			`${resolve('/levels/[id]', {
				id: data.level.id.toString()
			})}?${params}`,
			{
				noScroll: true,
				keepFocus: true,
				replaceState: true
			}
		);
	}

	const revision = $derived(data.level.revisions[0]);

	const badge = $derived(levelToBadge(data.level));
	const difficulty = $derived(levelToDifficulty(data.level));

	const song_name = $derived(
		data.song
			? data.song.title
			: (SongInfo[(revision.audio_track + 1).toString() as keyof typeof SongInfo]?.name ??
					'Unknown')
	);

	const song_artist = $derived(
		data.song
			? data.song.artist_name
			: (SongInfo[(revision.audio_track + 1).toString() as keyof typeof SongInfo]?.artist ?? 'DJVI')
	);
</script>

<svelte:head>
	<title>{revision.name} - 1.9 GDPS</title>
	<meta name="og:site_name" content="1.9 GDPS" />
	<meta name="og:title" content={revision.name} />
	<meta name="og:description" content={revision.description} />
</svelte:head>

<div class="level-header">
	<DifficultyIcon stars={data.level.stars} {difficulty} {badge} />

	<div class="title-container">
		<div class="level-title">
			{revision.name}

			{#if revision.objects > 100_000}
				<img src={HighObjectIcon} alt="high objects" class="title-badge" />
			{/if}
		</div>

		<div>
			<Link
				href={resolve('/users/[id]', {
					id: data.level.author.id.toString()
				})}>{data.level.author.name}</Link
			>
		</div>

		<div class="stats-container">
			<div class="level-stat">
				<img src={DownloadIcon} alt="downloads" />
				{formatNumber(data.level.downloads)}
			</div>

			<div class="level-stat">
				{#if data.level.likes >= 0}
					<img src={LikesIcon} alt="likes" />
				{:else}
					<img src={DislikeIcon} alt="likes" />
				{/if}

				{formatNumber(data.level.likes)}
			</div>
		</div>

		<div class="stats-container">
			{#if revision.objects > 0}
				<div class="level-stat">
					<img src={ObjectIcon} alt="objects" />
					{formatNumber(revision.objects)}
				</div>
			{/if}

			<div class="level-stat">
				<img src={LengthIcon} alt="length" />
				{lengthToString(revision.length)}
			</div>

			{#if revision.original_id && revision.objects == 0}
				<div class="level-stat">
					<img src={CollaborationIcon} alt="likes" />

					<Link
						href={resolve('/levels/[id]', {
							id: revision.original_id.toString()
						})}
					>
						{revision.original_id}
					</Link>
				</div>
			{/if}
		</div>

		{#if revision.original_id && revision.objects != 0}
			<div class="stats-container">
				<div class="level-stat">
					<img src={CollaborationIcon} alt="likes" />

					<Link
						href={resolve('/levels/[id]', {
							id: revision.original_id.toString()
						})}
					>
						{revision.original_id}
					</Link>
				</div>
			</div>
			{/if}
	</div>
</div>

<div class="info-container">
	{#if revision.description}
		&ldquo;{revision.description}&rdquo;
	{:else}
		<i>No description provided.</i>
	{/if}
</div>

<div class="info-container">
	<div>
		<img src={NoteIcon} alt="note" class="song-icon" />

		{#if data.song && data.song.ingame_song_source == 0}
			<Link href={data.song.download}>{song_name} by {song_artist}</Link> ({revision.song_id})
		{:else}
			<span>
				{song_name} by {song_artist}

				{#if revision.song_id != 0}
					({revision.song_id})
				{/if}
			</span>
		{/if}
	</div>

	<br />

	<div>
		Uploaded:
		{#if data.level.upload_date != null}
			{new Date(data.level.upload_date).toLocaleString()}
		{/if}
	</div>

	{#if revision.created_at != null && (revision.created_at != data.level.upload_date || revision.version != 1)}
		<div>
			Last updated: {new Date(revision.created_at).toLocaleString()} (v{revision.version})
		</div>
	{/if}
</div>

{#if data.current_user && data.current_user.permission_level >= 1}
	<div style="padding: 0.5em;"></div>

	<div>
		<Link href={resolve('/comments') + `?level=${data.level.id}`}>Manage Comments</Link>

		<span class="bullet">&bull;</span>

		<Link href={resolve('/actions') + `?on_id=${data.level.id}`}>View Actions</Link>
	</div>
{/if}

<Title size={2}>Comments</Title>

{#if data.comments.items.length > 0}
	<Pagination
		count={data.comments.count}
		pageCount={data.comments.items.length}
		perPage={50}
		page={data.comments_page ?? 0}
		pluralName="comments"
		singularName="comment"
		onSelect={async (x) => {
			comments_page = x;
			await updateQueryParams();
		}}
	>
		<label for="type-select-bottom"> Sort by: </label>
		<select
			id="type-select-bottom"
			bind:value={sort_type}
			onchange={() => {
				comments_page = 0;
				updateQueryParams();
			}}
		>
			<option value="timestamp">Time</option>
			<option value="likes">Likes</option>
		</select>
	</Pagination>

	<div class="center">
		<div class="comments-container">
			{#each data.comments.items as comment (comment.id)}
				<CommentCell {comment} state="level" />
			{/each}
		</div>
	</div>

	<Pagination
		count={data.comments.count}
		pageCount={data.comments.items.length}
		perPage={50}
		page={data.comments_page ?? 0}
		pluralName="comments"
		singularName="comment"
		onSelect={async (x) => {
			comments_page = x;
			await updateQueryParams();
		}}
	>
		<label for="type-select-bottom"> Sort by: </label>
		<select
			id="type-select-bottom"
			bind:value={sort_type}
			onchange={() => {
				comments_page = 0;
				updateQueryParams();
			}}
		>
			<option value="timestamp">Time</option>
			<option value="likes">Likes</option>
		</select>
	</Pagination>
{:else}
	<div class="comments-container">No comments found!</div>
{/if}

<style>
	.center {
		width: 100%;
		justify-content: center;
		display: flex;
	}

	.comments-container {
		display: flex;
		flex-direction: column;

		row-gap: 1em;
	}

	.level-title {
		font-size: x-large;
		display: flex;
		column-gap: 0.5em;

		align-items: center;
	}

	.title-badge {
		height: 1em;
	}

	.level-stat {
		display: flex;
		align-items: center;

		column-gap: 0.25rem;
	}

	.level-header {
		display: flex;
		align-items: center;
		justify-content: center;

		gap: 1em;

		padding-top: 1em;
	}

	.title-container {
		display: flex;
		flex-direction: column;

		align-items: start;
		gap: 0.25em;
	}

	.stats-container {
		display: flex;
		flex-direction: row;
		align-items: center;

		gap: 1em;
		padding-top: 0.5em;
	}

	.level-stat img {
		max-height: 1.25rem;
	}

	.song-icon {
		height: 1em;
		margin-bottom: -0.2rem;
	}

	.info-container {
		display: flex;
		flex-direction: column;

		justify-content: space-between;
		padding-top: 1em;
	}

	.bullet {
		-webkit-user-select: none;
		user-select: none;
	}
</style>
