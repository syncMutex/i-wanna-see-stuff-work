import { numberToBytes } from "../utils";
import allocator, { AllocDisplay, Dealloc, Ptr } from "./allocator";

export class Chars implements AllocDisplay {
	chars: string;
	cap: number;

	static new(value: string): Ptr<Chars> {
		const newChars = new Chars(value);
		return allocator.malloc<Chars>(value.length, newChars);
	}

	constructor(value: string) {
		this.chars = value;
		this.cap = value.length;
	}

    toBytes(): Array<string> {
		return this.chars.split("").map(v => v.charCodeAt(0).toString());
	}

    toString() {
		return `chars: [${this.chars.split("").map(v => `'${v}'`).join(", ")}]`;
	}
}

export class Str implements AllocDisplay, Dealloc {
	static Size = 4 + 4 + 4;

	static new(value: string): Ptr<Str> {
		const newStr = new Str(value);
		return allocator.malloc<Str>(Str.Size, newStr);
	}

	charPtr: Ptr<Chars>;

	constructor(value: string) {
		this.charPtr = Chars.new(value);
	}

	setStr(value: string) {
		let charPtr = this.charPtr.v;
		charPtr.chars = value;
		if(value.length > charPtr.cap) {
			// TODO
		}
	}

	get chars(): string {
		return this.charPtr.v.chars
	}

	dealloc() {
		allocator.free(this.charPtr);
	}

    toBytes(): Array<string> {
		return [
			...numberToBytes(this.charPtr.v.cap),
			...numberToBytes(this.charPtr.v.chars.length),
			...this.charPtr.toBytes()
		]
	}

    toString() {
		return `str { cap: ${this.charPtr.size}, len: ${this.charPtr.v.chars.length}, charPtr: ${this.charPtr} }`;
	}
}

export class List<T extends AllocDisplay | number> implements AllocDisplay {
	arr: Array<T>;

	static new<T extends AllocDisplay | number>(arr: Array<T>, dsize: number): Ptr<List<T>> {
		const obj = new List<T>(arr);
		return allocator.malloc(arr.length * dsize, obj);
	}

	constructor(arr: Array<T>) {
		this.arr = arr;
	}

    toBytes(): Array<string> {
		if(this.arr.length === 0) {
			return [];
		}

		const type = typeof this.arr[0];
		const arr: Array<string> = [];

		if(type === "number") {
			for(let a of this.arr) {
				arr.push(...numberToBytes(a as number));
			}
		} else {
			for(let a of this.arr) {
				arr.push(...(a as AllocDisplay).toBytes());
			}
		}
		return arr;
	}

    toString(): string {
		return `[${this.arr.map(a => a.toString()).join(", ")}]`;
	}
}
