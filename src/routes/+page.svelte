<script lang="ts">
	import logo from '$lib/assets/ogp-icon.png';
	import Link from '$lib/components/core/Link.svelte';
	import LinkButton from '$lib/components/core/LinkButton.svelte';
	import { resolve } from '$app/paths';
	import { fade, fly } from 'svelte/transition';

	import YouTube from '$lib/components/icons/YouTube.svelte';
	import Twitter from '$lib/components/icons/Twitter.svelte';
	import Bluesky from '$lib/components/icons/Bluesky.svelte';
	import Discord from '$lib/components/icons/Discord.svelte';
	import Trophy from '$lib/components/icons/Trophy.svelte';
	import Download from '@lucide/svelte/icons/download';

	import Logo from '$lib/assets/icon.png';

	import PlaceholderImage from '$lib/assets/home/banner/placeholder.png?enhanced';
	import Level1 from '$lib/assets/home/banner/12353.png?enhanced&blur=8&brightness=0.5';
	import Level2 from '$lib/assets/home/banner/14895.png?enhanced&blur=8&brightness=0.5';
	import Level3 from '$lib/assets/home/banner/22006.png?enhanced&blur=8&brightness=0.5';
	import Level4 from '$lib/assets/home/banner/28539.png?enhanced&blur=8&brightness=0.5';
	import Level5 from '$lib/assets/home/banner/72524.png?enhanced&blur=8&brightness=0.5';
	import Level6 from '$lib/assets/home/banner/307901.png?enhanced&blur=8&brightness=0.5';

	const banner_listing = [
		{ src: Level4, name: 'Unreality by GrenadeofTacos', id: 28539 },
		{ src: Level1, name: 'Death Moon by Reupload', id: 12353 },
		{ src: Level2, name: 'Melting Storm by RoiMousti', id: 14895 },
		{ src: Level6, name: 'minecraft level by Samuraychik', id: 307901 },
		{ src: Level3, name: 'SENSE by nezopi', id: 22006 },
		{ src: Level5, name: 'R0Y681V by Cersia', id: 72524 }
	];

	let current_img_idx = $state(0);
	const current_img = $derived(banner_listing[current_img_idx]);

	let previous_img = $state(banner_listing[0]);

	const increment_image = () => {
		setTimeout(() => {
			previous_img = banner_listing[current_img_idx];
		}, 4000);

		if (current_img_idx + 1 >= banner_listing.length) {
			current_img_idx = 0;
		} else {
			current_img_idx += 1;
		}
	};

	$effect(() => {
		const timer = setInterval(increment_image, 5000);
		return () => clearInterval(timer);
	});
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

<div class="img-container">
	<!-- blank image for box sizing -->
	<enhanced:img src={PlaceholderImage} alt="blank" class="screenshot-placeholder" />

	<enhanced:img src={previous_img['src']} alt={previous_img['name']} class="screenshot" />

	{#key current_img}
		<div in:fade={{ duration: 500 }}>
			<enhanced:img src={current_img['src']} alt={current_img['name']} class="screenshot" />
		</div>
	{/key}

	<div class="hero-content">
		<h1 class="title">
			<img src={Logo} alt="logo" class="logo" />
			1.9 GDPS
		</h1>

		<div class="description">
			<p>
				A Geometry Dash private server for the 1.9 client.

				<br />

				Available on Windows and Android.
			</p>
		</div>

		<div class="download-btn">
			<LinkButton href={resolve('/download')}>
				<span class="link-icon"><Download /> Download</span>
			</LinkButton>
		</div>
	</div>

	<div class="banner-link">
		<a
			href={resolve('/levels/[id]', {
				id: current_img['id'].toString()
			})}>{current_img['name']}</a
		>
	</div>
</div>

Check out the 1.9 GDPS on other sites!

<div class="social-links">
	<div>
		<Link href="https://discord.gg/eCGFrCG">
			<span class="link-icon"><Discord /> Discord</span>
		</Link>
	</div>

	<span class="bullet">&bull;</span>

	<div>
		<Link href="https://demonlist.19gdps.com/">
			<span class="link-icon"><Trophy /> Demonlist</span>
		</Link>
	</div>
</div>

<div class="social-links">
	<div>
		<Link href="https://www.youtube.com/channel/UCIUpOcn9GZ-IlEw34czouIg">
			<span class="link-icon"><YouTube /> 19GDPSOfficial</span>
		</Link>
	</div>

	<span class="bullet">&bull;</span>

	<div>
		<Link href="https://twitter.com/official19gdps">
			<span class="link-icon"><Twitter /> official19gdps</span>
		</Link>
	</div>

	<span class="bullet">&bull;</span>

	<div>
		<Link href="https://bsky.app/profile/19gdps.bsky.social">
			<span class="link-icon"><Bluesky /> 19gdps.bsky.social</span>
		</Link>
	</div>
</div>

<div class="bullet-list">
	<div class="bullet-card">
		<enhanced:img
			src="$lib/assets/home/info/gameplay.png?w=400"
			alt="screenshot of Windy Landscape"
			class="promo-image"
		/>

		<span>
			Relive the 1.9 experience, with visuals and physics exactly as they were 10 years ago!
		</span>
	</div>

	<div class="bullet-card reversed">
		<enhanced:img
			src="$lib/assets/home/info/editor.png?w=400"
			alt="screenshot of the 1.9 editor"
			class="promo-image"
		/>

		<span> Push the limits of the classic 1.9 editor! </span>
	</div>

	<div class="bullet-card">
		<enhanced:img
			src="$lib/assets/home/info/main.png?w=400"
			alt="screenshot of the main level, Jack Russel"
			class="promo-image"
		/>

		<span>
			Challenge yourself with the new main levels, which grant you original icons and colors!
		</span>
	</div>

	<div class="bullet-card reversed">
		<enhanced:img
			src="$lib/assets/home/info/creators.png?w=400"
			alt="screenshot of the level search page"
			class="promo-image"
		/>

		<span>
			Enjoy the thousands of levels made by other creators, including levels granted our exclusive <span
				class="super-text">Super</span
			> rating!
		</span>
	</div>

	<div class="bullet-card">
		<enhanced:img
			src="$lib/assets/home/info/options.png?w=400"
			alt="screenshot of the gameplay options"
			class="promo-image"
		/>

		<span>
			Customize your experience as you wish, with several quality-of-life changes built-in!
		</span>
	</div>

	<div class="bullet-card reversed">
		<enhanced:img
			src="$lib/assets/home/info/mods.png?w=400"
			alt="screenshot of the mods list"
			class="promo-image"
		/>

		<span>
			The bundled modloader (based on <Link href="https://geode-sdk.org">Geode</Link>) gives
			developers the option to modify the game however they want!
		</span>
	</div>
</div>

<div class="video-link">
	<h2>Latest 1.9 GDPS showcase:</h2>

	<iframe
		src="https://www.youtube-nocookie.com/embed/videoseries?list=UUIUpOcn9GZ-IlEw34czouIg"
		title="1.9 GDPS YouTube Uploads"
	></iframe>
</div>

<style>
	.bullet-card {
		display: flex;
		align-items: center;

		justify-content: center;
		flex-wrap: wrap;
		column-gap: 2em;
		row-gap: 1em;
	}

	.bullet-card.reversed {
		flex-direction: row-reverse;
	}

	.bullet-card span {
		flex-grow: 1;
		flex-shrink: 1;
		flex-basis: 0%;

		min-width: 128px;
	}

	.super-text {
		background-image: linear-gradient(to right, #cf43df, #3c7bcd);
		color: transparent;
		background-clip: text;

		font-weight: 500;
	}

	.bullet-list {
		display: flex;
		flex-direction: column;

		gap: 2em;

		margin: 2em auto;

		max-width: 60%;
	}

	.promo-image {
		width: 400px;
		height: auto;

		aspect-ratio: 16 / 9;
		border-radius: 8px;

		box-shadow: 0 1px 10px 0 rgba(0, 0, 0, 0.15);
	}

	.link-icon {
		display: flex;
		gap: 0.25rem;

		align-items: center;
	}

	.screenshot-placeholder {
		width: 100%;
		height: auto;

		aspect-ratio: 16 / 9;

		min-height: 400px;
		max-height: 512px;
		object-fit: cover;
	}

	.screenshot {
		width: 100%;
		height: auto;

		aspect-ratio: 16 / 9;

		min-height: 400px;
		max-height: 512px;

		position: absolute;

		object-fit: cover;
		object-position: center;

		transform: scale(1.05);

		left: 0%;
		top: 0%;
	}

	.hero-content {
		position: absolute;

		left: 5%;

		display: flex;
		flex-direction: column;
		align-items: start;
	}

	.hero-content .description {
		color: white;

		text-align: left;

		text-shadow: 2px 2px 4px rgba(0, 0, 0, 1);
	}

	.logo {
		height: 4.5rem;
	}

	.title {
		display: flex;
		align-items: center;
		gap: 0.25em;

		width: 100%;
		justify-content: left;

		color: white;

		margin: 0;

		filter: drop-shadow(0px 0px 4px rgba(0, 0, 0, 0.5));
	}

	.social-links {
		display: flex;
		justify-content: center;
		padding-top: 1em;
		flex-wrap: wrap;

		margin: auto 1%;
	}

	.bullet {
		-webkit-user-select: none;
		user-select: none;
		margin: 0.15rem 0.5rem;
	}

	.img-container {
		position: relative;

		width: 100%;

		display: flex;
		align-items: center;
		justify-content: center;

		overflow: clip;

		mask-image: linear-gradient(to bottom, black 95%, transparent 100%);
		margin-bottom: 1em;

		gap: 0.5em;

		background-color: #222;
	}

	.video-link {
		margin-top: 1em;
	}

	.video-link iframe {
		border: none;
		border-radius: 8px;

		aspect-ratio: 16 / 9;
		object-fit: fill;

		width: 100%;
		max-width: 48em;

		box-shadow: 0 1px 10px 0 rgba(0, 0, 0, 0.15);
	}

	.download-btn {
		filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.25));
	}

	.banner-link {
		position: absolute;
		bottom: 11%;
		right: 1%;

		display: none;
	}

	.banner-link a {
		color: rgba(255, 255, 255, 0.5);
		text-decoration: none;

		font-size: small;
	}

	.banner-link a:hover {
		text-decoration: underline;
	}
</style>
