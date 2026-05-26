<script lang="ts">
	import DefaultTopIcon from '$lib/assets/rank/top.png';
	import Top1Icon from '$lib/assets/rank/top1.png';
	import Top10Icon from '$lib/assets/rank/top10.png';
	import Top50Icon from '$lib/assets/rank/top50.png';
	import Top100Icon from '$lib/assets/rank/top100.png';
	import Top200Icon from '$lib/assets/rank/top200.png';
	import Top500Icon from '$lib/assets/rank/top500.png';
	import Top1000Icon from '$lib/assets/rank/top1000.png';
	import Top2500Icon from '$lib/assets/rank/top2500.png';
	import Top5000Icon from '$lib/assets/rank/top5000.png';
	import Top10000Icon from '$lib/assets/rank/top10000.png';
	import type { HTMLImgAttributes } from 'svelte/elements';

	interface Props extends HTMLImgAttributes {
		rank: number;
	}

	const { rank, ...rest }: Props = $props();

	const selected_icon = $derived.by(() => {
		if (rank <= 1) return Top1Icon;
		else if (rank <= 10) return Top10Icon;
		else if (rank <= 50) return Top50Icon;
		else if (rank <= 100) return Top100Icon;
		else if (rank <= 200) return Top200Icon;
		else if (rank <= 500) return Top500Icon;
		else if (rank <= 1000) return Top1000Icon;
		else if (rank <= 2500) return Top2500Icon;
		else if (rank <= 5000) return Top5000Icon;
		else if (rank <= 10000) return Top10000Icon;
		else return DefaultTopIcon;
	});
</script>

<img src={selected_icon} alt="rank trophy" {...rest} />

<style>
	img {
		height: 3em;
	}
</style>
