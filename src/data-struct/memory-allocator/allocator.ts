import { ShallowReactive, shallowReactive } from "vue";
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
	bg: string;
	fg: string;
	isFree: boolean;
	
	constructor(size: number, start: number, idx: number, bg: string, fg: string) {
		this.size = size;
		this.start = start;
		this.idx = idx;
		this.bg = bg;
		this.fg = fg;
		this.isFree = false;
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

	constructor(size: number, start: number, idx: number, value: T, bg: string, fg: string) {
		super(size, start, idx, bg, fg);
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
	allocated: Array<ShallowReactive<Ptr<AllocDisplay>>> = shallowReactive([]);
	freed: Array<ShallowReactive<Ptr<AllocDisplay>>> = shallowReactive([]);

	public malloc<T extends AllocDisplay>(
		size: number,
		value: T,
		bg: string = "rgb(255, 255, 255)",
		fg: string = "rgb(0, 0, 0)"
	): ShallowReactive<Ptr<T>> {
		const last = this.allocated[this.allocated.length - 1];
		const ptr = shallowReactive(new Ptr(
			size,
			last ? last.end() : 0,
			this.allocated.length,
			value,
			bg, fg
		));
		this.allocated.push(shallowReactive(ptr));
		return ptr;
	}

	public realloc<T extends AllocDisplay>(ptr: Ptr<T>, newSize: number, newVal: T): Ptr<T> {
		ptr;
		return new Ptr(0, newSize, this.allocated.length, newVal, "", "");
	}

	public resetExceptNull() {
		this.allocated.splice(1, this.allocated.length);
	}

	public free<T extends AllocDisplay | Dealloc>(ptr: Ptr<T>) {
		this.allocated[ptr.idx].isFree = true;
		if((ptr.v as Dealloc).dealloc !== undefined) {
			(ptr.v as Dealloc).dealloc();
		}
	}
}

const allocator = new Allocator;
export const NULL = allocator.malloc<Null>(4, new Null, "#ffffff", "#000000");

export default allocator;
