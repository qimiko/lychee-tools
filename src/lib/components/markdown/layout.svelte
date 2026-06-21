<script module>
	import { h1, h2, a, p, ul, li, ol } from './components';
	// eslint-disable-next-line no-import-assign
	export { h1, h2, a, p, ul, li, ol };
</script>

<script lang="ts">
	let { children } = $props();
</script>

<svelte:head>
	<meta name="og:site_name" content="1.9 GDPS" />
</svelte:head>

<div>
	{@render children?.()}
</div>
