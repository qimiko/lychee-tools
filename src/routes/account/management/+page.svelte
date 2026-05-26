<script>
	import Title from '$lib/components/core/Title.svelte';
	import LinkButton from '$lib/components/core/LinkButton.svelte';
	import { formatTimestamp } from '$lib';
	import FormInput from '$lib/components/core/FormInput.svelte';
	import { resolve } from '$app/paths';
	import { enhance } from '$app/forms';

	let { data, form } = $props();

	let hide_ip = $state(true);
</script>

<svelte:head>
	<title>Account Management - 1.9 GDPS</title>
	<meta name="og:title" content="1.9 GDPS" />
</svelte:head>

<Title>Account Management</Title>
<div class="main-container">
	<LinkButton href={resolve('/account/management/change-password')}>Change Password</LinkButton>
	<LinkButton href={resolve('/account/management/change-username')}>Change Username</LinkButton>
	<LinkButton href={resolve('/account/management/legacy-token')}>
		{#if data.extra_details.has_legacy_token}
			Reset 2.2 Login
		{:else}
			Enable 2.2 Login
		{/if}
	</LinkButton>
</div>

<Title size={2}>Active Devices</Title>

<label>
	<input type="checkbox" bind:checked={hide_ip} />
	Hide IP Addresses
</label>

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
				<td>
					<form method="POST" use:enhance action="?/logout_device">
						<input type="hidden" name="key" value={device.id} />
						<FormInput type="submit" value="X" />
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

	<FormInput type="submit" value="Log out of all devices" />
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

		<FormInput type="submit" value="New Session" />
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

	table {
		width: 100%;
		border: none;
		border-spacing: 0;
	}

	table thead {
		background-color: white;
	}

	th {
		border: none;
	}

	td {
		border: none;
	}

	tbody tr:nth-child(even) {
		background-color: #fafafa;
	}
</style>
