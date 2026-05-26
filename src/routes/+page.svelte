<script lang="ts">
	import logo from '$lib/assets/ogp-icon.png';
	import Title from '$lib/components/core/Title.svelte';
	import Link from '$lib/components/core/Link.svelte';
	import LinkButton from '$lib/components/core/LinkButton.svelte';
	import { resolve } from '$app/paths';
</script>

<svelte:head>
	<title>1.9 GDPS</title>
	<meta name="og:title" content="1.9 GDPS" />
	<meta
		name="og:description"
		content="1.9 GDPS aims to emulate Update 1.9 of Geometry Dash, widely regarded as one of the best eras in the game, for users and players that did not initially have the chance to experience it."
	/>
	<meta name="og:image" content={logo} />
</svelte:head>

<Title>1.9 Private Server</Title>

<p>
	A Geometry Dash Private Server designed for the 1.9 client <br />
	Available on Windows and Android
</p>

<Title>Download & Join</Title>

<p class="nobox">
	The 1.9 community server is at the heart of the 1.9 GDPS as a hub for updates, support and to just
	hang out<br />
	Join the 1.9 community Discord server at <Link href="https://discord.gg/eCGFrCG"
		>discord.gg/eCGFrCG</Link
	>. <br />
	Downloads are available on the <Link href={resolve('/download')}>downloads page</Link>.
</p>

<Title>Tools</Title>
<p>Check out the online tools for sessions, statistics, reuploads, account settings and more</p>
<p>
	<LinkButton href={resolve('/tools')}>Tools</LinkButton>
</p>
