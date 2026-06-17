<script lang="ts">
	import type { Snippet } from 'svelte';
	import IconButton from './core/IconButton.svelte';

	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';

	interface Props {
		count: number;
		page: number;
		perPage: number;
		pageCount: number;
		pluralName: string;
		singularName?: string;
		disabled?: boolean;
		children?: Snippet;

		onSelect: (page: number) => void | Promise<void>;
	}

	const {
		count,
		page,
		perPage,
		pageCount,
		pluralName,
		singularName = pluralName,
		disabled = false,
		onSelect,
		children
	}: Props = $props();

	const max_pages = $derived(Math.max(Math.ceil(count / perPage), 1));
	const disp_page = $derived(page + 1);
</script>

<div class="page-container">
	Showing {pageCount} out of {count}
	{count == 1 ? singularName : pluralName} <span class="bullet">&bull;</span>
	<IconButton
		onclick={async () => {
			await onSelect(Math.max(page - 1, 0));
		}}
		disabled={disabled || page == 0}>
		<ChevronLeft />
	</IconButton>

	Page {disp_page} of {max_pages}

	<IconButton
		onclick={async () => {
			await onSelect(Math.min(page + 1, max_pages));
		}}
		disabled={disabled || count == 0 || disp_page == max_pages}>
		<ChevronRight />
	</IconButton>

	{#if children}
		<span class="bullet">&bull;</span>
		<div>
			{@render children()}
		</div>
	{/if}
</div>

<style>
	.bullet {
		-webkit-user-select: none;
		user-select: none;
	}

	.page-container {
		padding: 0.5em 0;
		display: flex;
		justify-content: center;
		align-items: center;

		gap: 0.5em;
	}
</style>
