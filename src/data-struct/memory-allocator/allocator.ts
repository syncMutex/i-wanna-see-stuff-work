import { reactive, ref } from "vue";
import { numberToBytes, numberToHex } from "../utils";

export interface AllocDisplay {
	toBytes: () => Array<string>;
	toString: () => string;
}

export interface Dealloc {
	dealloc: () => void;
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

export class Null implements AllocDisplay {
	static Bytes = ["00", "00", "00", "00"];
	static Hex = "0x00000000";

    toBytes(): Array<string> {
		return Null.Bytes;
	}

    toString() {
		return `NULL: ${Null.Hex}`;
	}
}

export class Ptr<T extends AllocDisplay | Dealloc> extends AllocBlock implements AllocDisplay {
	static Size = 4;

	v: T;

	constructor(size: number, start: number, idx: number, value: T) {
		super(size, start, idx, "");
		this.v = value;
	}

    toBytes(): Array<string> {
		return numberToBytes(this.start);
	}

    toString() {
		return `0x${numberToHex(this.start)}`;
	}

	end() {
		return this.start + this.size;
	}
}

class Allocator {
	allocated: Array<Ptr<AllocDisplay>> = [];
	freed: Array<Ptr<AllocDisplay>> = [];

	refreshToggle = ref(false);

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

	public free<T extends AllocDisplay | Dealloc>(ptr: Ptr<T>) {
		this.allocated.splice(ptr.idx, 1);
		if((ptr.v as Dealloc).dealloc !== undefined) {
			(ptr.v as Dealloc).dealloc();
		}
	}
}

const allocator = new Allocator;
export const NULL = allocator.malloc<Null>(4, new Null);

export default reactive(allocator);
