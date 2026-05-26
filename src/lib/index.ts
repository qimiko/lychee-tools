import type { ServerLevel } from './api';

export function loadImage(url: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => resolve(img);
		img.onerror = (err) => reject(err);

		img.src = url;
	});
}

export function toIntSafe(value: string | null) {
	if (!value) return undefined;

	const as_int = parseInt(value);
	if (Number.isNaN(as_int)) return undefined;

	return as_int;
}

export function undefIfEmpty<T>(value: T[]) {
	if (value.length > 0) return value;

	return undefined;
}

export function onlyIfTrue(value: string | null) {
	if (value == 'true') return true;

	return undefined;
}

export function levelToDifficulty(level: ServerLevel) {
	if (level.auto) {
		return 'auto';
	} else if (level.demon) {
		return 'demon';
	}

	switch (level.difficulty) {
		default:
		case 0:
			return 'na';
		case 1:
			return 'easy';
		case 2:
			return 'normal';
		case 3:
			return 'hard';
		case 4:
			return 'harder';
		case 5:
			return 'insane';
	}
}

export function levelToBadge(level: ServerLevel) {
	if (level.rating > 1) {
		return 'epic';
	} else if (level.rating > 0) {
		return 'feature';
	} else {
		return 'none';
	}
}

export function lengthToString(length: number, short: boolean = false) {
	switch (length) {
		default:
			return 'Tiny';
		case 1:
			return 'Short';
		case 2:
			return 'Medium';
		case 3:
			return 'Long';
		case 4:
			return short ? 'XL' : 'Extra-Long';
	}
}

export function iconTypeToString(x: number) {
	switch (x) {
		default:
		case 0:
			return 'cube';
		case 1:
			return 'ship';
		case 2:
			return 'ball';
		case 3:
			return 'ufo';
		case 4:
			return 'wave';
	}
}

export function formatNumber(x: number): string {
	return x.toLocaleString();
}

export function formatShortNumber(x: number): string {
	const formatter = new Intl.NumberFormat('en', {
		notation: 'compact',
		maximumFractionDigits: 1,
		roundingMode: 'trunc'
	});

	return formatter.format(x);
}

export function formatTimestamp(x: string): string {
	return Intl.DateTimeFormat(undefined, {
		dateStyle: 'short',
		timeStyle: 'medium'
	}).format(new Date(x));
}

export function formatRelativeTimestamp(x: string): string {
	// from <https://www.builder.io/blog/relative-time>
	const timeDiff = Date.parse(x) - Date.now();
	const deltaSeconds = Math.round(timeDiff / 1000);

	const cutoffs = [60, 3600, 86400, 86400 * 7, 86400 * 30, 86400 * 365, Infinity];

	const units: Intl.RelativeTimeFormatUnit[] = [
		'second',
		'minute',
		'hour',
		'day',
		'week',
		'month',
		'year'
	];

	const unitIndex = cutoffs.findIndex((cutoff) => cutoff > Math.abs(deltaSeconds));

	const divisor = unitIndex ? cutoffs[unitIndex - 1] : 1;

	const rtf = new Intl.RelativeTimeFormat('en');
	return rtf.format(Math.floor(deltaSeconds / divisor), units[unitIndex]);
}
