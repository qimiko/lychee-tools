<script lang="ts">
	import logo from '$lib/assets/ogp-icon.png';
	import Title from '$lib/components/core/Title.svelte';
	import LinkButton from '$lib/components/core/LinkButton.svelte';

	const { data } = $props();
</script>

<svelte:head>
	<title>Downloads - 1.9 GDPS</title>
	<meta name="og:title" content="1.9 GDPS" />
	<meta name="og:description" content="Download links for the 1.9 GDPS." />
	<meta name="og:image" content={logo} />
</svelte:head>

<Title>1.9 GDPS (u{data.update.version}) Downloads</Title>

<b
	>By downloading the below versions, you confirm that you own a legal version of the game on said
	device.</b
>

<p><LinkButton href={data.update.links.windows_portable}>Windows (ZIP)</LinkButton></p>
<p><LinkButton href={data.update.links.windows}>Windows (Installer)</LinkButton></p>
<p><LinkButton href={data.update.links.android}>Android</LinkButton></p>
