export function sleep(ms: number) {
	return new Promise((r) => {
		setTimeout(r, ms);
	});
}

export function randInt(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min) + min);
}

export function hexToRGB(s: string) {
	const r = parseInt(s.slice(1, 3), 16);
	const g = parseInt(s.slice(3, 5), 16);
	const b = parseInt(s.slice(5, 7), 16);
	return { r, g, b };
}

