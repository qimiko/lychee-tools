<script>
	let { children } = $props();
</script>

<svelte:head>
	<title>FAQ - 1.9 GDPS</title>
	<meta name="og:site_name" content="1.9 GDPS" />
	<meta name="og:title" content="Editor Guide" />
	<title>Editor Guide - 1.9 GDPS</title>
</svelte:head>

<div class="title-container">
	<h1 class="title">
		<enhanced:img src="$lib/assets/icon.png" alt="logo" class="logo" />
		1.9 GDPS
	</h1>

	<i> Editor Guide </i>
</div>

<enhanced:img src="$lib/assets/faq/guide.png" alt="screenshot of the editor" class="screenshot" />

<div>
	{@render children?.()}
</div>

<style>
	.title {
		display: flex;
		align-items: center;
		gap: 0.25em;

		margin-top: 1em;
		margin-bottom: 0;
	}

	.logo {
		height: 4.5rem;
		width: auto;
	}

	.title-container {
		display: flex;
		flex-direction: column;

		align-items: center;
		margin-bottom: 2em;
	}

	.screenshot {
		display: block;

		margin: 0 auto;
		height: auto;

		width: 95%;
		max-width: 90ch;
	}
</style>
