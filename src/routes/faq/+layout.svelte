<script lang="ts">
	let { children } = $props();
</script>

<svelte:head>
	<title>FAQ - 1.9 GDPS</title>
	<meta name="og:site_name" content="1.9 GDPS" />
	<meta name="og:title" content="Frequently Asked Questions" />
</svelte:head>

<div>
	{@render children?.()}
</div>
