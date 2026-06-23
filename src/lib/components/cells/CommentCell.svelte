<script lang="ts">
	import { resolve } from '$app/paths';
	import type { ServerComment } from '$lib/api';
	import Link from '../core/Link.svelte';
	import PlayerIcon from '../render/PlayerIcon.svelte';
	import DislikeIcon from '$lib/assets/icons/dislike.png';
	import LikeIcon from '$lib/assets/icons/like.png';
	import { formatRelativeTimestamp, formatTimestamp } from '$lib';

	import ModBadge from '$lib/assets/badges/mod.png';
	import AdminBadge from '$lib/assets/badges/admin.png';

	interface Props {
		comment: ServerComment;
		state?: 'level' | 'user' | 'global';
		showManageBox?: boolean;
		checked?: boolean;
		onCheck?: (comment_id: number) => void;
	}

	const {
		comment,
		state = 'level',
		showManageBox = false,
		onCheck,
		checked = false
	}: Props = $props();

	const user = $derived(comment.author);

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

<div class="cell">
	<div class="top-row">
		<div class="player-name">
			{#if state != 'user'}
				<div class="player-info">
					<div class="icon-container">
						<PlayerIcon
							icon={user.icon}
							color1={user.color}
							color2={user.color2}
							glow={user.special == 2}
							iconType={icon_type}
							maxHeight="2rem"
							maxWidth="3rem"
						/>
					</div>
					<Link
						href={resolve('/users/[id]', {
							id: user.id.toString()
						})}>{user.name}</Link
					>

					{#if user.permission_level && user.permission_level > 1}
						<img src={AdminBadge} alt="admin" class="player-badge" />
					{:else if user.permission_level && user.permission_level > 0}
						<img src={ModBadge} alt="mod" class="player-badge" />
					{/if}
				</div>
			{/if}
			{#if state == 'user'}
				<div>
					<Link
						href={resolve('/levels/[id]', {
							id: comment.level_id.toString()
						})}>{comment.level_id}</Link
					>
				</div>
			{/if}
			<span title={formatTimestamp(comment.created)}>
				{formatRelativeTimestamp(comment.created)}
			</span>
		</div>

		<div class="likes-container">
			{comment.likes}
			{#if comment.likes >= 0}
				<img src={LikeIcon} alt="likes" class="likes-icon" />
			{:else}
				<img src={DislikeIcon} alt="likes" class="likes-icon" />
			{/if}
		</div>
	</div>

	<div class="main-body">
		<div class="text">
			{comment.body}
		</div>
	</div>

	<div class="actions-container">
		{#if showManageBox}
			<input type="checkbox" {checked} onchange={() => onCheck?.call(undefined, comment.id)} />
		{/if}

		{#if state == 'global'}
			<div>
				<Link
					href={resolve('/levels/[id]', {
						id: comment.level_id.toString()
					})}>{comment.level_id}</Link
				>
			</div>

			<span>&bull;</span>
		{/if}

		<span class="comment-id">
			#{comment.id}
		</span>
	</div>
</div>

<style>
	.cell {
		display: flex;

		flex-direction: column;

		width: min(90vw, 35rem);
		min-height: 5rem;

		background-color: rgba(0, 0, 0, 0.05);
		border-radius: 16px;
		padding: 1em 1em 1em 1em;

		box-shadow: #bbb 0 1px 10px;

		row-gap: 0.5em;
		align-items: center;
	}

	.player-badge {
		padding-left: 0.25rem;
		height: 1.5em;
	}

	.cell:hover {
		background-color: rgba(0, 0, 0, 0.1);
	}

	.icon-container {
		width: 3rem;
		height: auto;

		margin-right: 0.25em;
	}

	.top-row {
		display: flex;
		width: 100%;
		justify-content: space-between;

		gap: 1em;
	}

	.comment-id {
		color: gray;
	}

	.player-name {
		display: flex;
		align-items: center;
	}

	.player-name > *:not(:last-child)::after {
		content: '•';
		padding: 0 0.25em;
	}

	.player-info {
		display: flex;
		align-items: center;
	}

	.main-body {
		display: flex;
		width: 100%;

		flex-grow: 1;
	}

	.main-body .text {
		flex-grow: 1;
		text-align: left;
		overflow-wrap: break-word;
		width: 100%;

		max-width: 90vw;
	}

	.likes-icon {
		height: 1.5rem;
	}

	.actions-container {
		display: flex;
		flex-direction: row;

		align-items: end;
		justify-content: end;
		width: 100%;
		gap: 0.25em;
	}

	.likes-container {
		display: flex;
		align-items: center;

		column-gap: 0.5em;
	}
</style>
