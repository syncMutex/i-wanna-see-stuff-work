export function sleep(ms: number) {
	return new Promise((r) => {
		setTimeout(r, ms);
	});
}

export function randInt(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min) + min);
}

