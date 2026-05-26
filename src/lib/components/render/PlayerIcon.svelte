<script lang="ts">
	import { onMount } from 'svelte';

	import Outfits from '$lib/outfits.json';
	import { loadImage } from '$lib';

	type IconType = 'cube' | 'ball' | 'ship' | 'wave' | 'ufo';

	interface Props {
		icon: number;
		iconType: IconType;
		color1: number;
		color2: number;
		glow: boolean;

		maxWidth?: string;
		maxHeight?: string;
	}

	const props: Props = $props();

	function generate_icon_state() {
		return [props.icon, props.iconType, props.color1, props.color2, props.glow].join('-');
	}

	let icon_drawn = $state<string | null>(null);

	let image: HTMLImageElement;
	let observer: IntersectionObserver | undefined;

	function getPathForType(type: IconType, id: number, layer: -1 | 1 | 2 | 3) {
		let base = 'cube/player';
		let max = Outfits.playerMaxId;

		switch (type) {
			case 'ball':
				base = 'ball/player_ball';
				max = Outfits.ballMaxId;
				break;
			case 'ship':
				base = 'ship/ship';
				max = Outfits.shipMaxId;
				break;
			case 'wave':
				base = 'wave/dart';
				max = Outfits.dartMaxId;
				break;
			case 'ufo':
				base = 'ufo/bird';
				max = Outfits.birdMaxId;
				break;
		}

		id = Math.max(Math.min(id, max), 1);

		let layer_suffix = '';
		switch (layer) {
			case -1:
				layer_suffix = '_glow';
				break;
			case 2:
				layer_suffix = '_2';
				break;
			case 3:
				layer_suffix = '_3';
				break;
		}

		const path_id = id.toString().padStart(2, '0');

		return `/icon/${base}_${path_id}${layer_suffix}_001.png`;
	}

	function tintImage(image: HTMLImageElement, color: number) {
		const buffer = document.createElement('canvas');
		buffer.height = image.height;
		buffer.width = image.width;

		const color_value = '#' + color.toString(16).padStart(6, '0');

		const ctx = buffer.getContext('2d');
		if (!ctx) return undefined;

		ctx.drawImage(image, 0, 0, image.width, image.height);

		ctx.globalCompositeOperation = 'multiply';
		ctx.fillStyle = color_value;
		ctx.fillRect(0, 0, image.width, image.height);

		ctx.globalCompositeOperation = 'destination-in';
		ctx.drawImage(image, 0, 0, image.width, image.height);

		return buffer;
	}

	function getBottomTransparency(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
		const width = canvas.width;
		const height = canvas.height;

		const check_data = ctx.getImageData(0, 0, width, height).data;

		for (let y = height - 1; y >= 0; y--) {
			for (let x = 0; x < width; x++) {
				const idx = y * width + x;
				if (check_data[idx * 4 + 3] != 0) {
					return y + 1;
				}
			}
		}

		return 0;
	}

	async function drawIcon() {
		const state = generate_icon_state();
		if (icon_drawn == state) {
			return;
		}

		const canvas = document.createElement('canvas');
		canvas.width = 300;
		canvas.height = 300;

		const ctx = canvas.getContext('2d');
		if (!ctx) {
			return;
		}

		const color_promise = loadImage(getPathForType(props.iconType, props.icon, 2));
		const base_promise = loadImage(getPathForType(props.iconType, props.icon, 1));

		let max_width = 0;
		let max_height = 0;

		const drawCentered = (img: HTMLImageElement | HTMLCanvasElement) => {
			const x = Math.abs(canvas.width - img.width) / 2;
			const y = Math.abs(canvas.height - img.height) / 2;

			ctx.drawImage(img, x, y, img.width, img.height);

			max_height = Math.max(max_height, img.height);
			max_width = Math.max(max_width, img.width);
		};

		if (props.iconType == 'ufo') {
			const top_layer = await loadImage(getPathForType(props.iconType, props.icon, 3));
			drawCentered(top_layer);
		}

		if (props.glow) {
			const glow_image = await loadImage(getPathForType(props.iconType, props.icon, -1));
			let color = Outfits.playerColors[props.color2] ?? 0;
			if (color == 0) color = Outfits.playerColors[props.color1] ?? 0;
			if (color == 0) color = 0xffffff;

			const tinted = tintImage(glow_image, color);
			if (tinted) drawCentered(tinted);
		}

		{
			const color_image = await color_promise;
			const color = Outfits.playerColors[props.color2] ?? 0;
			const tinted = tintImage(color_image, color);
			if (tinted) drawCentered(tinted);
		}

		{
			const base_image = await base_promise;
			const color = Outfits.playerColors[props.color1] ?? 0;
			const tinted = tintImage(base_image, color);
			if (tinted) drawCentered(tinted);
		}

		// weird evil math to determine amount on bottom to crop
		const bottom_crop =
			max_height + (canvas.height - max_height) / 2 - getBottomTransparency(canvas, ctx);

		const outer_canvas = document.createElement('canvas');
		outer_canvas.width = max_width;
		outer_canvas.height = max_height - bottom_crop;

		// achieve cropping out the edges by repainting
		const outer_ctx = outer_canvas.getContext('2d');
		if (!outer_ctx) {
			return;
		}

		outer_ctx.drawImage(
			canvas,
			(max_width - canvas.width) / 2,
			(max_height - canvas.height) / 2,
			canvas.width,
			canvas.height
		);

		const data = outer_canvas.toDataURL('data/png');
		image.src = data;

		icon_drawn = state;
	}

	onMount(() => {
		observer = new IntersectionObserver(
			(entries) => {
				const visible = entries[0].isIntersecting;
				if (visible)
					drawIcon().catch((e) => {
						console.error(e);
					});
			},
			{
				threshold: 0.25
			}
		);

		observer.observe(image);

		return () => {
			observer?.disconnect();
		};
	});

	$effect(() => {
		if (icon_drawn) drawIcon();
	});
</script>

<img
	bind:this={image}
	alt={`${props.iconType} ${props.icon}`}
	style:max-width={props.maxWidth}
	style:max-height={props.maxHeight}
/>

<style>
	img {
		width: auto;
		height: auto;
		object-fit: contain;
	}
</style>
