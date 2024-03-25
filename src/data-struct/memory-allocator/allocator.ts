import { reactive } from "vue";
import { ptrToHexStr } from "../utils";

export interface AllocDisplay {
	getBytes: () => Array<string>;
	getString: () => string;
}

export class AllocBlock {
	size: number;
	start: number;
	idx: number;
	color: string;
	
	constructor(size: number, start: number, idx: number, color: string) {
		this.size = size;
		this.start = start;
		this.idx = idx;
		this.color = color;
	}

	end() {
		return this.start + this.size;
	}
}

export class Ptr<T extends AllocDisplay> extends AllocBlock implements AllocDisplay {
	value: T;

	constructor(size: number, start: number, idx: number, value: T) {
		super(size, start, idx, "");
		this.value = value;
	}

    getBytes(): Array<string> {
		let hex = ptrToHexStr(this.start);
		let arr: Array<string> = [];

		for(let i = 2; i < hex.length; i += 2) {
			arr.push(hex.slice(i, i + 2));
		}

		return arr;
	}

    getString() {
		return ptrToHexStr(this.start);
	}

	end() {
		return this.start + this.size;
	}
}

class Allocator {
	allocated: Array<Ptr<AllocDisplay>> = [];
	freed: Array<Ptr<AllocDisplay>> = [];

	public malloc<T extends AllocDisplay>(size: number, value: T): Ptr<T> {
		const last = this.allocated[this.allocated.length - 1];
		const ptr = new Ptr(size, last ? last.end() : 0, this.allocated.length, value);
		this.allocated.push(ptr);
		return ptr;
	}

	public realloc<T extends AllocDisplay>(ptr: Ptr<T>, newSize: number, newVal: T): Ptr<T> {
		ptr;
		return new Ptr(0, newSize, this.allocated.length, newVal);
	}

	public free(ptr: AllocBlock) {
		this.allocated.splice(ptr.idx, 1);
	}
}

export class Str implements AllocDisplay {
	value: string;
	ptr: Ptr<Str>;

	constructor(value: string) {
		this.value = value;
		this.ptr = allocator.malloc(value.length, this);
	}

	setStr(value: string) {
		this.value = value;
		// TODO: if value.length > ptr.size then realloc
	}

    getBytes(): Array<string> {
		return this.value.split("").map(v => v.charCodeAt(0).toString());
	}

    getString() {
		return `string: "${this.value}", length: ${this.value.length}`;
	}
}

export class Arr<T> implements AllocDisplay {
	value: Array<T>;
	ptr: Ptr<Arr<T>>;

	constructor(value: Array<T>) {
		this.value = value;
		this.ptr = allocator.malloc(value.length, this);
	}

    getBytes() {
		return []
	}

    getString() {
		return "";
	}
}

const allocator = new Allocator;
export default reactive(allocator);
