import { ShallowRef, shallowRef } from "vue";
import { numberToBytes } from "../utils";
import allocator, { AllocDisplay, Dealloc, Ptr } from "./allocator";

export class Chars implements AllocDisplay {
	charsRef: ShallowRef<string>;
	cap: number;

	static new(value: string): Ptr<Chars> {
		const newChars = new Chars(value);
		const mem = allocator.malloc<Chars>(value.length, newChars);
		return mem;
	}

	constructor(value: string) {
		this.charsRef = shallowRef(value);
		this.cap = value.length;
	}

	get chars(): string {
		return this.charsRef.value;
	}

    toBytes(): Array<string> {
		return this.chars.split("").map(v => v.charCodeAt(0).toString());
	}

    toString() {
		return `chars [${this.chars.split("").map(v => `'${v}'`).join(", ")}]`;
	}
}

export class Str implements AllocDisplay, Dealloc {
	static Size = 4 + 4 + 4;

	static new(value: string): Ptr<Str> {
		const newStr = new Str(value);
		const mem = allocator.malloc<Str>(Str.Size, newStr);
		return mem;
	}

	charPtr: Ptr<Chars>;

	constructor(value: string) {
		this.charPtr = Chars.new(value);
	}

	setStr(value: string) {
		let charPtr = this.charPtr.v;
		charPtr.charsRef.value = value;
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
		return `str { cap: ${this.charPtr.size}, len: ${this.charPtr.v.chars.length}, ptr: ${this.charPtr} }`;
	}
}

export class Arr<T extends AllocDisplay | number> implements AllocDisplay {
	arr: Array<T>;
	cap: number;

	static new<T extends AllocDisplay | number>(arr: Array<T>, dsize: number): Ptr<Arr<T>> {
		const obj = new Arr<T>(arr);
		return allocator.malloc(arr.length * dsize, obj);
	}

	constructor(arr: Array<T>) {
		this.arr = arr;
		this.cap = arr.length;
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

export class List<T extends AllocDisplay | number> implements AllocDisplay {
	static Size = 4 + 4 + 4;

	arrPtr: Ptr<Arr<T>>;

	static new<T extends AllocDisplay | number>(arr: Array<T>, dsize: number): Ptr<List<T>> {
		const obj = new List<T>(arr, dsize);
		const mem = allocator.malloc(List.Size, obj);
		return mem;
	}

	constructor(arr: Array<T>, dsize: number) {
		this.arrPtr = Arr.new(arr, dsize);
	}

    toBytes(): Array<string> {
		return [
			...numberToBytes(this.arrPtr.v.cap),
			...numberToBytes(this.arrPtr.v.arr.length),
			...this.arrPtr.toBytes()
		];
	}

    toString(): string {
		return `List { cap: ${this.arrPtr.v.cap}, length: ${this.arrPtr.v.arr.length}, ptr: ${this.arrPtr} }`;
	}
}
