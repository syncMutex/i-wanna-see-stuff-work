import { Point } from "../../geometry";

export enum Heuristics {
	Manhattan = "Manhattan",
	Euclidian = "Euclidian",
	ChebyshevDistance = "Chebyshev",
	OctileDistance = "Octile",
}

export function manhattan(node: Point, dest: Point) {
	const D = 2;
	const dx = Math.abs(node.x - dest.x);
	const dy = Math.abs(node.y - dest.y);
	return D * (dx + dy);
}

export function euclidian(node: Point, dest: Point) {
	const D = 2;
	const dx = Math.abs(node.x - dest.x);
	const dy = Math.abs(node.y - dest.y);
	return D * Math.sqrt(dx * dx + dy * dy);
}

export function chebyshevDistance(node: Point, dest: Point) {
	const D = 2, D2 = 3;
	const dx = Math.abs(node.x - dest.x)
	const dy = Math.abs(node.y - dest.y)
	return D * (dx + dy) + (D2 - 2 * D) * Math.min(dx, dy);
}

export function octileDistance(node: Point, dest: Point) {
	const D = 2, D2 = Math.sqrt(4);
	const dx = Math.abs(node.x - dest.x)
	const dy = Math.abs(node.y - dest.y)
	return D * (dx + dy) + (D2 - 2 * D) * Math.min(dx, dy);
}
