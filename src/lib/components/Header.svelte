<script lang="ts">
	import { resolve } from '$app/paths';
	import type { ServerMe } from '$lib/api/index';
	import { page } from '$app/state';
	import PlayerIcon from './render/PlayerIcon.svelte';
	import { iconTypeToString } from '$lib';
	import ModBadge from '$lib/assets/badges/mod.png';
	import AdminBadge from '$lib/assets/badges/admin.png';
	import OwnerBadge from '$lib/assets/badges/owner.png';

	interface Props {
		profile: ServerMe | null;
	}

	let { profile }: Props = $props();

	const current_page = $derived(page.url.pathname);
	const login_base = resolve('/account/login');

	const login_path = $derived(
		current_page == login_base
			? login_base
			: login_base + `?redirect=${encodeURIComponent(current_page)}`
	);
</script>

<div class="topnav">
	<!-- div class="links">
    <a href={resolve("/")} class="logo-container">
      <img src={GDPSLogo} alt="1.9 GDPS" class="logo" />
    </a>
    <a href={resolve("/download")}>Download</a>
    <a href={resolve("/tools")}>Tools</a>
    <a href={resolve("/leaderboards")}>Leaderboards</a>
  </div -->
	<a href={resolve('/')}>1.9 GDPS</a>

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
		<a href={login_path}>Login</a>
	{/if}
</div>

<style>
	.topnav {
		overflow: hidden;
		background-color: #333;

		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.topnav::after {
		content: '';
		position: absolute;
		height: 4px;
		width: 100%;
		top: 48px;
		left: 0px;

		background: repeating-linear-gradient(
			45deg,
			#ffcc00,
			/* Start yellow */ #ffcc00 20px,
			/* End yellow at 20px */ #000000 20px,
			/* Start black at 20px */ #000000 40px /* End black at 40px (total pattern width) */
		);
	}

	.topnav a:not(.logo-container) {
		float: left;
		display: block;
		color: #f2f2f2;
		text-align: center;
		padding: 14px 16px;
		text-decoration: none;
		font-size: 17px;
	}

	.topnav a:hover {
		background-color: #444;
		color: white;
	}

	.topnav a:active {
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

	/*
.links {
  display: flex;
  align-items: center;
}

.logo-container {
  padding: 0 1em;
}

.logo {
  height: 2.5em;
  display: block;
}
*/
</style>
