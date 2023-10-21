export class Point {
	x: number = 0;
	y: number = 0;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	static offset(p: Point, offset: Point) {
		return new Point(p.x + offset.x, p.y + offset.y);
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

	getPositionAlongTheLine(percentage: number) {
		return {
			x: this.p1.x * (1.0 - percentage) + this.p2.x * percentage,
			y: this.p1.y * (1.0 - percentage) + this.p2.y * percentage
		};
	}

	static orientation(p: Point, q: Point, r: Point) {
		let val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
		if (val == 0) return 0;
		return (val > 0) ? 1: 2;
	}

	private static onSegment(p: Point, q: Point, r: Point) {
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

	isPointLieOnLine(p: Point): boolean {
		return Line.onSegment(this.p1, this.p2, p);
	}

	pointOfIntersect(l: Line): Point {
		const denom = (this.a * l.b) - (l.a * this.b);
		const x = ((this.b * l.c) - (l.b * this.c)) / denom;
		const y = ((this.c * l.a) - (l.c * this.a)) / denom;

		return new Point(x, y);
	}
}

export class Vector {
	i: number;
	j: number;

	constructor(p1: Point, p2: Point) {
		this.i = p2.x - p1.x;
		this.j = p2.y - p1.y;
	}

	static new(): Vector {
		return new Vector(new Point(0, 0), new Point(0, 0));
	}

	static from(i: number, j: number): Vector {
		const v = Vector.new();

		v.i = i;
		v.j = j;

		return v;
	}

	mag(): number {
		const { i, j } = this;
		return Math.sqrt(i * i + j * j);
	}

	unit(): Vector {
		const mag = this.mag();
		return Vector.from(this.i / mag, this.j / mag);
	}

	dot(v: Vector): number {
		return this.i * v.i + this.j * v.j;
	}

	cross(v: Vector): number {
		return this.i * v.j - this.j * v.i;
	}
}

