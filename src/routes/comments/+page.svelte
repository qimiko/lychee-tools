<script lang="ts">
	import CommentCell from '$lib/components/cells/CommentCell.svelte';

	import Title from '$lib/components/core/Title.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import FormInput from '$lib/components/core/FormInput.svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import { enhance } from '$app/forms';
	import Button from '$lib/components/core/Button.svelte';

	import MessageSquareDashed from '@lucide/svelte/icons/message-square-dashed';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import X from '@lucide/svelte/icons/x';

	let { data, form } = $props();

	let page = $derived(data.params.page ?? 0);
	let count = $derived(data.params.count ?? 50);

	let query = $derived(buildQueryParams(data.params.includes, data.params.excludes));
	let users = $derived(buildUserParams(data.params.users, data.params.exclude_users));
	let levels = $derived(data.params.levels?.join(' ') ?? '');

	let reverse = $derived(data.params.reverse ?? false);
	let type = $derived(data.params.sort ?? 'timestamp');

	let exclude_users = $derived(data.params.exclude_users);
	let include_users = $derived(data.params.users);

	let include_phrases = $derived(data.params.includes);
	let exclude_phrases = $derived(data.params.excludes);

	const enable_management = $derived((data.current_user?.permission_level ?? 0) >= 1);

	function buildQueryParams(includes?: string[], excludes?: string[]) {
		const includes_query = includes?.map((w) => (w.includes(' ') ? `"${w}"` : w)).join(' ') ?? '';

		const excludes_query =
			excludes?.map((w) => (w.includes(' ') ? `-"${w}"` : `-${w}`)).join(' ') ?? '';

		return includes_query.length != 0 && excludes_query.length != 0
			? `${includes_query} ${excludes_query}`
			: includes_query + excludes_query;
	}

	function buildUserParams(includes?: number[], excludes?: number[]) {
		const includes_query = includes?.join(' ') ?? '';

		const excludes_query = excludes?.map((w) => -w).join(' ') ?? '';

		return includes_query.length != 0 && excludes_query.length != 0
			? `${includes_query} ${excludes_query}`
			: includes_query + excludes_query;
	}

	async function updateQueryParams() {
		// eslint-disable-next-line svelte/prefer-svelte-reactivity
		const params = new URLSearchParams();
		params.set('page', page.toString());
		params.set('count', count.toString());

		if (exclude_users) {
			for (const u of exclude_users) {
				params.append('exclude_user', u.toString());
			}
		}

		if (include_users) {
			for (const u of include_users) {
				params.append('user', u.toString());
			}
		}

		if (include_phrases) {
			for (const u of include_phrases) {
				params.append('include', u);
			}
		}

		if (exclude_phrases) {
			for (const u of exclude_phrases) {
				params.append('exclude', u);
			}
		}

		if (levels) {
			const level_ids = levels.split(' ').map((p) => parseInt(p));
			for (const i of level_ids) {
				params.append('level', i.toString());
			}
		}

		if (reverse) {
			params.set('reverse', 'true');
		}

		params.set('sort', type);

		// eslint-disable-next-line svelte/no-navigation-without-resolve
		await goto(`${resolve('/comments')}?${params}`, {
			noScroll: true,
			keepFocus: true,
			replaceState: true
		});
	}

	function parseQuery(s: string): [string[], string[]] {
		const words = s.split(' ');
		const include_phrases = [];
		const exclude_phrases = [];

		let in_phrase = false;
		let current_phrase = [];
		let is_negative = false;

		for (const word of words) {
			if (word.length == 0) continue;

			let substr_index = 0;
			let ending_phrase = false;

			if (word.startsWith('-')) {
				is_negative = true;
				substr_index++;
			}

			if (word.substring(substr_index).startsWith('"')) {
				in_phrase = true;
				substr_index++;
			}

			if (word.endsWith('"')) {
				ending_phrase = true;
			}

			const to_add = word.substring(substr_index, ending_phrase ? word.length - 1 : word.length);

			if (to_add.length == 0) continue;

			if (in_phrase) {
				current_phrase.push(to_add);
			} else {
				if (is_negative) {
					exclude_phrases.push(to_add);
				} else {
					include_phrases.push(to_add);
				}
				is_negative = false;
			}

			if (ending_phrase) {
				const joined = current_phrase.join(' ');

				if (is_negative) {
					exclude_phrases.push(joined);
				} else {
					include_phrases.push(joined);
				}

				is_negative = false;
				in_phrase = false;
				current_phrase = [];
			}
		}

		return [exclude_phrases, include_phrases];
	}

	function parseUserIds(s: string): [number[], number[]] {
		const words = s.split(' ');
		const include_users = [];
		const exclude_users = [];

		for (const word of words) {
			const id = parseInt(word);
			if (!id) continue;

			if (id < 0) {
				exclude_users.push(-id);
			} else {
				include_users.push(id);
			}
		}

		return [exclude_users, include_users];
	}

	function onSearch(e: SubmitEvent) {
		e.preventDefault();

		page = 0;
		[exclude_phrases, include_phrases] = parseQuery(query);
		[exclude_users, include_users] = parseUserIds(users);
		updateQueryParams();
	}

	const checked_boxes = new SvelteSet<number>();
</script>

<svelte:head>
	<title>Comments - 1.9 GDPS</title>
	<meta name="og:site_name" content="1.9 GDPS" />
	<meta name="og:title" content="Comments" />
</svelte:head>

<Title>Comments</Title>

<Title size={2}>Usage</Title>

<p>Separate UserIDs and words by spaces, put phrases in quotes</p>

<p>If you want to exclude a userid/word/phrase, put a `-` before it.</p>

<p>
	e.g. <b>thing "my phrase" -no -"dios mio"</b> will search for comments:
</p>

<ul>
	<li><b>With</b> the word "thing"</li>
	<li><b>With</b> the phrase "my phrase"</li>
	<li><b>Without</b> the word "no"</li>
	<li><b>Without</b> the phrase "dios mio"</li>
</ul>

<hr />

<form onsubmit={onSearch}>
	<FormInput type="text" placeholder="Query" bind:value={query} />

	<br />

	<FormInput type="text" placeholder="User IDs" bind:value={users} />

	<br />

	<FormInput type="text" placeholder="Level IDs" bind:value={levels} />

	<br />

	<label for="sort-select"> Sort By: </label>

	<select id="sort-select" bind:value={type}>
		<option value="timestamp">Time</option>
		<option value="body">Body</option>
		<option value="user_id">User ID</option>
		<option value="user_name">Username</option>
		<option value="level_id">Level ID</option>
		<option value="likes">Likes</option>
	</select>

	<br />

	<FormInput type="checkbox" id="reverse-box" label="Reverse Sort?" bind:checked={reverse} />

	<Button type="submit">Go</Button>
</form>

<hr />

{#snippet comments_management()}
	<Pagination
		count={data.comments.count}
		pageCount={data.comments.items.length}
		perPage={data.params.count ?? 50}
		page={data.params.page ?? 0}
		pluralName="comments"
		singularName="comment"
		onSelect={async (x) => {
			page = x;
			await updateQueryParams();
		}}
	/>

	<div class="management-options">
		{#if enable_management}
			<Button
				onclick={() => {
					data.comments.items.forEach((c) => {
						checked_boxes.add(c.id);
					});
				}}>Select All</Button
			>
		{/if}

		{#if checked_boxes.size > 0}
			{#if checked_boxes.size == 1}
				<div>{checked_boxes.size} comment selected.</div>
			{:else}
				<div>{checked_boxes.size} comments selected.</div>
			{/if}

			<Button onclick={() => checked_boxes.clear()} icon={X}>Clear Selection</Button>
		{/if}
	</div>

	{#if checked_boxes.size > 0}
		<div class="management-options">
			<form method="POST" action="?/bulk_delete" use:enhance>
				{#each checked_boxes as item (item)}
					<input type="hidden" name="comment" value={item} />
				{/each}
				<Button formaction="?/bulk_hide" icon={MessageSquareDashed}>Hide</Button>
				<Button type="submit" buttonStyle="emphasis" icon={Trash2}>Delete</Button>
			</form>
		</div>
	{/if}

	{#if form?.error}
		<p>{form.error}</p>
	{:else if form?.success}
		<p>Action performed!</p>
	{/if}
	<div style="padding: 0.5em;"></div>
{/snippet}

{#if data.comments.count > 0}
	{@render comments_management()}

	<div class="center">
		<div class="comments-container">
			{#each data.comments.items as comment (comment.id)}
				<CommentCell
					{comment}
					state="global"
					showManageBox={enable_management}
					checked={checked_boxes.has(comment.id)}
					onCheck={(id) => {
						if (checked_boxes.has(id)) {
							checked_boxes.delete(id);
						} else {
							checked_boxes.add(id);
						}
					}}
				/>
			{/each}
		</div>
	</div>

	{@render comments_management()}
{:else}
	<div class="comments-container">No comments found!</div>
{/if}

<style>
	.center {
		display: flex;
		width: 100%;
		justify-content: center;
	}

	.comments-container {
		display: flex;
		flex-direction: column;

		row-gap: 1em;
	}

	.management-options {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0.5em;
	}
</style>
