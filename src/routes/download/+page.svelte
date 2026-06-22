<script lang="ts">
	import logo from '$lib/assets/ogp-icon.png';
	import Title from '$lib/components/core/Title.svelte';
	import Button from '$lib/components/core/Button.svelte';

	import FolderArchive from '@lucide/svelte/icons/folder-archive';
	import Android from '$lib/components/icons/Android.svelte';
	import Windows from '$lib/components/icons/Windows.svelte';
	import Link from '$lib/components/core/Link.svelte';

	const { data } = $props();
</script>

<svelte:head>
	<title>Downloads - 1.9 GDPS</title>
	<meta name="og:title" content="1.9 GDPS" />
	<meta name="og:description" content="Download links for the 1.9 GDPS." />
	<meta name="og:image" content={logo} />
</svelte:head>

<Title>1.9 GDPS Downloads</Title>

<div class="download-buttons">
	<div>
		Downloading version <b>u{data.update.version}</b>.
	</div>

	<b>
		By downloading the below versions, you confirm that you own a legal version of the game on said
		device.
	</b>

	<div>
		<Button href={data.update.links.windows} icon={Windows}>Download for Windows</Button>

		<p>
			<Link href={data.update.links.windows_portable}>
				<span class="link-icon">
					<FolderArchive size={18} /> ZIP archive for Windows
				</span>
			</Link>
		</p>
	</div>

	<div>
		<Button href={data.update.links.android} icon={Android}>Download for Android</Button>

		<p>Android download only works on 32-bit devices!</p>
	</div>
</div>

<style>
	.download-buttons {
		display: flex;
		flex-direction: column;

		align-items: center;

		gap: 1em;

		margin: 0 0.5em;
	}

	.link-icon {
		display: flex;
		gap: 0.25rem;

		align-items: center;
	}
</style>
