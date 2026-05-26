<script lang="ts">
	import '@fontsource-variable/inter';

	import '../app.css';
	import favicon from '$lib/assets/favicon.ico';
	import Header from '$lib/components/Header.svelte';

	let { children, data } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<Header profile={data.current_user} />

<div class="smain">
	{@render children?.()}
</div>

<style>
	.smain {
		text-align: center;
	}
</style>
