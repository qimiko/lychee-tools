<script lang="ts">
	import { resolve } from '$app/paths';
	import type { ServerMe } from '$lib/api/index';
	import { page } from '$app/state';
	import PlayerIcon from './render/PlayerIcon.svelte';
	import { iconTypeToString } from '$lib';
	import ModBadge from '$lib/assets/badges/mod.png';
	import AdminBadge from '$lib/assets/badges/admin.png';
	import OwnerBadge from '$lib/assets/badges/owner.png';
	import { env } from '$env/dynamic/public';

	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import ChevronUp from '@lucide/svelte/icons/chevron-up';

	import { beforeNavigate } from '$app/navigation';

	interface Props {
		profile: ServerMe | null;
	}

	let { profile }: Props = $props();

	const current_page = $derived(page.url.pathname);
	const login_base = resolve('/account/login');

	const login_path = $derived(
		current_page == login_base || current_page == '/'
			? login_base
			: login_base + `?redirect=${encodeURIComponent(current_page)}`
	);

	let overflow_open = $state(false);

	beforeNavigate(() => {
		overflow_open = false;
	});
</script>

{#snippet profile_btn()}
	<div class="account-items">
		{#if profile}
			{#if profile.user}
				<a
					href={resolve('/users/[id]', {
						id: profile.user.id.toString()
					})}
				>
					<div class="icon-container">
						<PlayerIcon
							icon={profile.user.icon}
							color1={profile.user.color}
							color2={profile.user.color2}
							glow={profile.user.special == 2}
							iconType={iconTypeToString(profile.user.icon_type)}
							maxHeight="1.5em"
						/>

						{profile.name}

						{#if profile.permission_level > 2}
							<img src={OwnerBadge} alt="owner" class="stats-icon" />
						{:else if profile.permission_level > 1}
							<img src={AdminBadge} alt="admin" class="stats-icon" />
						{:else if profile.permission_level > 0}
							<img src={ModBadge} alt="mod" class="stats-icon" />
						{/if}
					</div>
				</a>
			{:else}
				<a href={resolve('/account/management')}>
					<div class="icon-container">
						{profile.name}
						{#if profile.permission_level > 1}
							<img src={AdminBadge} alt="admin" class="stats-icon" />
						{:else if profile.permission_level > 0}
							<img src={ModBadge} alt="mod" class="stats-icon" />
						{/if}
					</div>
				</a>
			{/if}
		{:else}
			<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
			<a href={login_path}>Login</a>
		{/if}
	</div>
{/snippet}

<div
	class="topnav"
	class:menu-open={overflow_open}
	class:beta={env.PUBLIC_SITE_TESTING == 'true'}
>
	<div class="links">
		<a href={resolve('/')} class="logo-container" title="1.9 GDPS">
			<enhanced:img src="$lib/assets/icon.png" alt="1.9 GDPS" class="logo" />
		</a>

		<a href={resolve('/download')} class="hidden-small">Download</a>
		<a href={resolve('/tools')} class="hidden-small">Tools</a>
		<a href={resolve('/leaderboards')} class="hidden-small">Leaderboards</a>
	</div>

	<div class="account-container hidden-small">
		{@render profile_btn()}
	</div>

	<button class="show-small button" onclick={() => (overflow_open = !overflow_open)}>
		<div class="overflow-btn">
			{#if overflow_open}
				<ChevronUp />
			{:else}
				<ChevronDown />
			{/if}
		</div>
	</button>
</div>

{#if overflow_open}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="overflow-background" onclick={() => (overflow_open = false)}></div>
	<div
		class="topnav-overflow show-small"
		onfocusout={({ relatedTarget, currentTarget }) => {
			if (relatedTarget instanceof HTMLElement && currentTarget.contains(relatedTarget)) {
				return;
			}

			overflow_open = false;
		}}
	>
		<a href={resolve('/download')}>Download</a>
		<a href={resolve('/tools')}>Tools</a>
		<a href={resolve('/leaderboards')}>Leaderboards</a>

		<div class="overflow-account-container">
			{@render profile_btn()}
		</div>
	</div>

	<!-- for an incredibly silly illusion -->
	<div style="height: 52px;"></div>
{/if}

<style>
	.topnav {
		overflow: hidden;
		background-color: #333;

		display: flex;
		justify-content: space-between;
		align-items: center;

		height: 52px;
	}

	.topnav.menu-open {
		position: fixed;
		width: 100%;
		top: 0;
		z-index: 99;
	}

	.account-container {
		height: 100%;
		margin-left: auto;
	}

	.account-items {
		height: 100%;
	}

	.topnav-overflow {
		height: auto;
		position: fixed;
		top: 52px;
		left: 0px;
		background-color: #333;

		width: 100%;

		border-bottom: 2px #222 solid;
		box-shadow: 0 5px 5px 0 rgba(0, 0, 0, 0.25);

		z-index: 99;
	}

	.topnav-overflow a {
		color: #f2f2f2;
		text-align: center;
		padding: 0 16px;
		text-decoration: none;
		font-size: 17px;

		height: 52px;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.topnav-overflow a:hover {
		background-color: #444;
		color: white;
	}

	.topnav-overflow a:active {
		background-color: #222;
		color: white;
	}

	.overflow-background {
		position: fixed;
		height: 100vh;
		width: 100vw;

		background-color: rgba(0, 0, 0, 0.5);

		z-index: 98;
	}

	.beta::after {
		content: '';
		position: absolute;
		height: 4px;
		width: 100%;
		top: 52px;
		left: 0px;

		background: repeating-linear-gradient(
			45deg,
			#ffcc00,
			/* Start yellow */ #ffcc00 20px,
			/* End yellow at 20px */ #000000 20px,
			/* Start black at 20px */ #000000 40px /* End black at 40px (total pattern width) */
		);

		z-index: 97;
	}

	.button {
		appearance: none;
		background-color: transparent;
		border: none;
	}

	.overflow-btn {
		display: flex;
		align-items: center;
	}

	.topnav a:not(.logo-container),
	.button {
		color: #f2f2f2;
		text-align: center;
		padding: 0 16px;
		text-decoration: none;
		font-size: 17px;

		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.topnav a:hover,
	.button:hover {
		background-color: #444;
		color: white;
	}

	.topnav a:active,
	.button:active {
		background-color: #222;
		color: white;
	}

	.icon-container {
		display: flex;
		gap: 0.5em;
		align-items: center;
	}

	.stats-icon {
		height: 1.5em;
	}

	.links {
		display: flex;
		height: 100%;
		align-items: stretch;
	}

	.logo-container {
		display: flex;
		align-items: center;

		height: 100%;
	}

	.logo {
		height: 2.5em;
		width: auto;
		display: block;

		padding: 0 0.5em;
	}

	@media screen and (max-width: 600px) {
		.links a.hidden-small {
			display: none;
		}

		.hidden-small {
			display: none;
		}
	}

	.show-small {
		display: inline-block;
	}

	@media screen and (min-width: 601px) {
		.show-small {
			display: none;
		}
	}
</style>
