<script lang="ts">
	import type { PageData } from './$types.js';

	import LevelCell from '$lib/components/cells/LevelCell.svelte';
	import CommentCell from '$lib/components/cells/CommentCell.svelte';
	import Title from '$lib/components/core/Title.svelte';
	import Link from '$lib/components/core/Link.svelte';
	import { resolve } from '$app/paths';
	import Pagination from '$lib/components/Pagination.svelte';
	import { goto } from '$app/navigation';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let comments_page = $derived(data.comments_page);
	let sort_type = $derived(data.comments_sort);

	const search_params = $derived(
		new URLSearchParams({
			type: 'user_levels',
			query: data.user.id.toString(),
			override_title: `Levels by ${data.user.name}`
		})
	);

	async function updateQueryParams() {
		// eslint-disable-next-line svelte/prefer-svelte-reactivity
		const params = new URLSearchParams();
		params.set('comments_page', comments_page.toString());
		params.set('comments_sort', sort_type);

		await goto(
			// eslint-disable-next-line svelte/no-navigation-without-resolve
			`${resolve('/users/[id]', {
				id: data.user.id.toString()
			})}?${params}`,
			{
				noScroll: true,
				keepFocus: true,
				replaceState: true
			}
		);
	}

	const description = $derived.by(() => {
		const parts = [`${data.user.stars} stars`, `${data.user.demons} demons`];

		if (data.user.creator_points > 0) {
			parts.push(`${data.user.creator_points} creator points`);
		}

		return parts.join(', ') + `, and ${data.user.coins} coins`;
	});
</script>

<svelte:head>
	<title>{data.user.name} - 1.9 GDPS</title>
	<meta name="og:site_name" content="1.9 GDPS" />
	<meta name="og:title" content={data.user.name} />
	<meta name="og:description" content={description} />
	<meta name="description" content={`User page for ${data.user.name}, with ${description}`} />
</svelte:head>

{#if data.levels.count > 0}
	<Title size={2}>Levels</Title>

	<div class="level-row">
		{#each data.levels.items as level (level.id)}
			<LevelCell {level} type="cell" />
		{/each}
	</div>

	{#if data.levels.count > data.levels.items.length}
		<Link href={resolve('/levels') + `?${search_params}`}>More</Link>
	{/if}
{/if}

<Title size={2}>Comments</Title>

{#if data.comments.count > 0}
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
		<label for="type-select-top"> Sort by: </label>
		<select
			id="type-select-top"
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
		<div class="comments-row">
			{#each data.comments.items as comment (comment.id)}
				<CommentCell {comment} state="user" />
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
	<div class="comments-row">No comments found!</div>
{/if}

<style>
	.center {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
	}

	.level-row {
		display: flex;
		flex-direction: row;

		column-gap: 1em;
		overflow-x: scroll;

		align-items: center;
		justify-content: safe center;

		padding: 1em;
	}

	.comments-row {
		display: flex;
		flex-direction: column;

		row-gap: 1em;
	}
</style>
