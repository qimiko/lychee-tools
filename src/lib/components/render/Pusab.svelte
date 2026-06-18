<script lang="ts">
	import { onMount } from 'svelte';

	import { loadImage } from '$lib';

	import BigFontDesc from '$lib/bigfont.json';
	import GoldFontDesc from '$lib/goldfont.json';
	import type { ClassValue } from 'svelte/elements';

	interface Props {
		text: string;
		gold?: boolean;
		maxWidth?: string;
		maxHeight?: string;
		color?: string;

		class?: ClassValue;
	}

	const props: Props = $props();

	let rendered = $state<string | null>(null);
	let image: HTMLImageElement;
	let observer: IntersectionObserver | undefined;

	function determineSize(text: string, gold: boolean): [number, number] {
		const font_desc = gold ? GoldFontDesc : BigFontDesc;

		let size_ctr = 0;
		const height = font_desc.common.lineHeight;

		let max_yoff = 0;
		let previous_char = 0;
		let previous_advance = 0;
		let previous_width = 0;

		for (let i = 0; i < text.length; i++) {
			const code = text.charCodeAt(i);
			if (code in font_desc.chars) {
				const key = code.toString() as keyof typeof font_desc.chars;
				const desc = font_desc.chars[key];

				size_ctr += desc.xadvance;

				previous_advance = desc.xadvance;
				previous_width = desc.width;

				if (desc.yoffset > max_yoff) {
					max_yoff = desc.height + desc.yoffset;
				}
			}

			const kerning_key = `${previous_char},${code}` as keyof typeof font_desc.kernings;
			if (kerning_key in font_desc.kernings) {
				size_ctr += font_desc.kernings[kerning_key].amount;
			}

			previous_char = code;
		}

		size_ctr = size_ctr - previous_advance + previous_width;

		return [size_ctr, Math.max(height, max_yoff)];
	}

	function recolorCanvas(base: HTMLCanvasElement, color: string) {
		const canvas = document.createElement('canvas');

		canvas.width = base.width;
		canvas.height = base.height;

		const ctx = canvas.getContext('2d');
		if (!ctx) {
			return;
		}

		ctx.drawImage(base, 0, 0);

		ctx.globalCompositeOperation = 'multiply';
		ctx.fillStyle = color;
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		// this isn't perfect, it messes up the shadow :(
		// i'll figure it out eventually
		ctx.globalCompositeOperation = 'destination-in';
		ctx.drawImage(base, 0, 0);

		return canvas;
	}

	function extractSprite(
		image: HTMLImageElement,
		x: number,
		y: number,
		width: number,
		height: number,
		pad_x: number,
		pad_y: number
	): HTMLCanvasElement | undefined {
		const canvas = document.createElement('canvas');

		canvas.width = width + pad_x;
		canvas.height = height + pad_y;

		if (width == 0 || height == 0) {
			return canvas;
		}

		const ctx = canvas.getContext('2d');
		if (!ctx) {
			return undefined;
		}

		ctx.drawImage(image, x, y, width, height, pad_x, pad_y, width, height);
		return canvas;
	}

	async function drawText() {
		if (rendered == props.text) return;

		const canvas = document.createElement('canvas');
		const [width, height] = determineSize(props.text, props.gold == true);

		canvas.width = width;
		canvas.height = height;

		const ctx = canvas.getContext('2d');
		if (!ctx) {
			return;
		}

		const url = props.gold ? 'goldFont-uhd.png' : 'bigFont-uhd.png';

		const sprites = await loadImage(`/text/${url}`);

		let x_pos = 0;
		let previous_char = 0;

		const font_desc = props.gold ? GoldFontDesc : BigFontDesc;

		for (const c of props.text) {
			const code = c.charCodeAt(0);
			const kerning_key = `${previous_char},${code}` as keyof typeof font_desc.kernings;
			if (kerning_key in font_desc.kernings) {
				x_pos += font_desc.kernings[kerning_key].amount;
			}

			if (code in font_desc.chars) {
				const key = code.toString() as keyof typeof font_desc.chars;
				const desc = font_desc.chars[key];

				if (desc.width == 0 || desc.height == 0) {
					x_pos += desc.xadvance;
					continue;
				}

				const sprite = extractSprite(
					sprites,
					desc.x,
					desc.y,
					desc.width,
					desc.height,
					desc.xoffset,
					desc.yoffset
				);
				if (!sprite) {
					continue;
				}

				ctx.drawImage(sprite, x_pos, 0);

				x_pos += desc.xadvance;
			}

			previous_char = code;
		}

		if (props.color) {
			const color_canvas = recolorCanvas(canvas, props.color);
			if (color_canvas) {
				const data = color_canvas.toDataURL('data/png');
				image.src = data;

				rendered = props.text + props.color;

				return;
			}
		}

		const data = canvas.toDataURL('data/png');
		image.src = data;

		rendered = props.text;
	}

	onMount(() => {
		observer = new IntersectionObserver(
			(entries) => {
				const visible = entries[0].isIntersecting;
				if (visible)
					drawText().catch((e) => {
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
		drawText();
	});
</script>

<div class={['img-container', props.class]}>
	<img
		bind:this={image}
		alt={props.text}
		style:max-width={props.maxWidth}
		style:max-height={props.maxHeight}
	/>

	<span class="overlay-text">
		{props.text}
	</span>
</div>

<style>
	.img-container img {
		grid-area: 1/1;
	}

	.overlay-text {
		grid-area: 1/1;
		color: transparent;
	}

	.img-container {
		display: grid;
	}
</style>
