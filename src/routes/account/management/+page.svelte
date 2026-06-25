<script>
	import Title from '$lib/components/core/Title.svelte';
	import { formatFileSize, formatTimestamp } from '$lib';
	import { resolve } from '$app/paths';
	import { enhance } from '$app/forms';

	import X from '@lucide/svelte/icons/x';
	import IconButton from '$lib/components/core/IconButton.svelte';
	import Button from '$lib/components/core/Button.svelte';

	let { data, form } = $props();

	let hide_ip = $state(true);

	const censored_email = $derived.by(() => {
		const parts = data.extra_details.email.split('@');

		if (parts.length != 2) {
			return data.extra_details.email;
		}

		const [user, domain] = parts;
		if (user.length == 0) {
			return data.extra_details.email;
		}

		return `${user[0]}*******@${domain}`;
	});
</script>

<svelte:head>
	<title>Account Management - 1.9 GDPS</title>
	<meta name="og:site_name" content="1.9 GDPS" />
	<meta name="og:title" content="Account Management" />
</svelte:head>

<Title>Account Management</Title>
<div class="main-container">
	<Button href={resolve('/account/management/change-password')}>Change Password</Button>
	<Button href={resolve('/account/management/change-username')}>Change Username</Button>
	<Button href={resolve('/account/management/legacy-token')}>
		{#if data.extra_details.has_legacy_token}
			Reset 2.2 Login
		{:else}
			Enable 2.2 Login
		{/if}
	</Button>
</div>

<div style="margin: 1em;">
	{#if data.extra_details.save_size !== null}
		<b>Save backup size</b>: {formatFileSize(data.extra_details.save_size)}
	{:else}
		No save data backed up!
	{/if}
</div>

<div style="margin: 1em;">
	<b>Email:</b>

	{#if hide_ip}
		{censored_email}
	{:else}
		{data.extra_details.email}
	{/if}

	<i>
		({#if data.extra_details.email_verified}
			Verified
		{:else}
			Unverified
		{/if})
	</i>
</div>

<label>
	<input type="checkbox" bind:checked={hide_ip} />
	Hide Sensitive Information
</label>

<Title size={2}>Active Devices</Title>

<div style="padding: 0.5em;"></div>

{#if form?.error && form.type == 'logout_device'}
	<p>{form.error}</p>
{:else if form?.success && form.type == 'logout_device'}
	<p>Logged out of device!</p>
{/if}

<table>
	<thead>
		<tr>
			<th>Created</th>
			<th>IP</th>
			<th>Remove</th>
		</tr>
	</thead>
	<tbody>
		{#each data.extra_details.devices as device (device.id)}
			<tr>
				<td>{formatTimestamp(device.created)}</td>
				<td>
					{#if hide_ip}
						<i>Hidden</i>
					{:else}
						{device.origin_ip}
					{/if}
				</td>
				<td style="padding: 0.5em;">
					<form method="POST" use:enhance action="?/logout_device">
						<input type="hidden" name="key" value={device.id} />
						<IconButton type="submit"><X /></IconButton>
					</form>
				</td>
			</tr>
		{/each}
	</tbody>
</table>

<div style="padding: 0.5em;"></div>

<form method="POST" use:enhance action="?/logout_all">
	{#if form?.error && form.type == 'logout_all'}
		<p>{form.error}</p>
	{:else if form?.success && form.type == 'logout_all'}
		<p>Logged out of all devices!</p>
	{/if}

	<Button type="submit" buttonStyle="emphasis">Log out of all devices</Button>

	<Button href={resolve('/account/logout')} data-sveltekit-reload>Log out</Button>
</form>

<Title size={2}>Sessions</Title>

<p>A active session is required for ingame requests on all versions prior to u9.0.4.</p>

{#if data.extra_details.has_session}
	<div>Luckily, you already have an active session!</div>
{:else}
	<form method="POST" use:enhance action="?/create_session">
		{#if form?.error && form.type == 'session'}
			<p>{form.error}</p>
		{:else if form?.success && form.type == 'session'}
			<p>Session created!</p>
		{/if}

		<Button type="submit">New Session</Button>
	</form>
{/if}

<div style="padding: 0.5em;"></div>

<style>
	.main-container {
		display: flex;
		flex-direction: column;
		align-items: center;

		gap: 0.5em;
	}
</style>
