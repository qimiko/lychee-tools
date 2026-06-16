<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		id: string;
		children: Snippet;
		question: string;
	}

	let { children, id, question }: Props = $props();
</script>

<div>
	<div {id}>
		{question}
	</div>

	<div>
		{@render children()}
	</div>
</div>
