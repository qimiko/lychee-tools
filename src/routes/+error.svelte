<script lang="ts">
	import { page } from '$app/state';
	import Button from '$lib/components/core/Button.svelte';

	import RefreshCw from '@lucide/svelte/icons/refresh-cw';
	import Hammer from '@lucide/svelte/icons/hammer';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
</script>

<h1>{page.status}</h1>

{#if page.error}
	<p>{page.error.message}</p>
{/if}

<Button onclick={() => goto(resolve('/tools'))} icon={Hammer}>Tools Page</Button>

{#if page.status != 404}
	<Button onclick={() => window.location.reload()} icon={RefreshCw} buttonStyle="emphasis">
		Refresh
	</Button>

	<p>
		If you were not expecting this message, please <b>report it</b> to the 1.9 GDPS staff. <br />
		Include the current URL and actions you were performing prior to this error.
	</p>

	<p>Thanks!</p>
{/if}

<style>
	p {
		max-width: 65ch;

		margin-left: auto;
		margin-right: auto;
	}
</style>
