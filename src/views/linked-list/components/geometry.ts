export class Point {
	x: number = 0;
	y: number = 0;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}
}

export class Line {
	p1: Point;
	p2: Point;

	a: number;
	b: number;
	c: number;

	constructor(p1: Point, p2: Point) {
		this.p1 = p1;
		this.p2 = p2;

		this.a = p1.y - p2.y;
		this.b = p2.x - p1.x;
		this.c = (p1.x * p2.y) - (p2.x * p1.y);
	}

	distance(): number {
		const dx = (this.p2.x - this.p1.x);
		const dy = (this.p2.y - this.p1.y);
		return Math.sqrt((dx*dx) + (dy*dy));
	}

	static orientation(p: Point, q: Point, r: Point) {
		let val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
		if (val == 0) return 0;
		return (val > 0) ? 1: 2;
	}

	static onSegment(p: Point, q: Point, r: Point) {
		return (
			q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) &&
			q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y)
		);
	}

	doIntersect(l: Line): boolean {
		const p1 = this.p1;
		const q1 = this.p2;
		const p2 = l.p1;
		const q2 = l.p2;

		let o1 = Line.orientation(p1, q1, p2);
		let o2 = Line.orientation(p1, q1, q2);
		let o3 = Line.orientation(p2, q2, p1);
		let o4 = Line.orientation(p2, q2, q1);

		if(o1 != o2 && o3 != o4) return true;
		if(o1 == 0 && Line.onSegment(p1, p2, q1)) return true;
		if(o2 == 0 && Line.onSegment(p1, q2, q1)) return true;
		if(o3 == 0 && Line.onSegment(p2, p1, q2)) return true;
		if(o4 == 0 && Line.onSegment(p2, q1, q2)) return true;
		return false;
	}

	findIntersection(l: Line): Point {
		const denom = (this.a * l.b) - (l.a * this.b);
		const x = ((this.b * l.c) - (l.b * this.c)) / denom;
		const y = ((this.c * l.a) - (l.c * this.a)) / denom;

		return new Point(x, y);
	}
}
