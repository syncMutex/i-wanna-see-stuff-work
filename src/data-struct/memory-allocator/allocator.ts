import { ShallowReactive, shallowReactive } from "vue";
import { numberToBytes, numberToHex } from "../utils";

export type DisplayableBlock = string | { ptr: string };

export interface AllocDisplay {
	toBytes: () => Array<string>;
	toString: () => string;
	toDisplayableBlocks: () => Array<DisplayableBlock>
}

export interface Dealloc {
	dealloc: () => void;
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

    toDisplayableBlocks() {
		return [` NULL: ${Null.Hex} `];
	}
}

export class Ptr<T extends AllocDisplay | Dealloc> implements AllocDisplay {
	static Size = 4;

	size: number;
	start: number;
	isFree: boolean;
	next: ShallowReactive<Ptr<any>> | null = null;
	
	v: T;

	constructor(size: number, start: number, value: T) {
		this.size = size;
		this.start = start;
		this.isFree = false;
		this.v = value;
	}

    toBytes(): Array<string> {
		return numberToBytes(this.start);
	}

    toString() {
		return `0x${numberToHex(this.start)}`;
	}

    toDisplayableBlocks() {
		return [`0x${numberToHex(this.start)}`];
	}

	end() {
		return this.start + this.size;
	}
}

export class FreedBlock<T extends AllocDisplay> implements AllocDisplay {
	bytes: Array<string>;
	stringRepr: string;

	constructor(val: T) {
		this.bytes = val.toBytes();
		this.stringRepr = val.toString();
	}

    toBytes(): Array<string> {
		return this.bytes;
	}

    toString() {
		return this.stringRepr;
	}

    toDisplayableBlocks() {
		return [this.stringRepr];
	}
}

type Block = Ptr<AllocDisplay>;

class BlockList {
	head = new Ptr(0, 0, new Null);

	*iter() {
		let temp: null | Block = this.head.next;

		while(temp !== null) {
			yield temp;
			temp = temp.next;
		}
	}

	getPrevOf(ptr: Block) {
		let prev: ShallowReactive<Block> = this.head;

		while(prev.next !== ptr) {
			prev = prev.next as ShallowReactive<Ptr<any>>;
		}

		return prev;
	}

	insertEnd(ptr: Block) {
		let temp: null | Block = this.head;

		while(temp.next !== null) {
			temp = temp.next;
		}

		ptr.start = temp.start + temp.size;
		temp.next = ptr;
	}

	isEmpty(): boolean {
		return this.head.next === null;
	}
}

class Allocator {
	allocated: ShallowReactive<BlockList> = shallowReactive(new BlockList);
	freed: Array<Block> = [];

	public malloc<T extends AllocDisplay>(size: number, value: T): ShallowReactive<Ptr<T>> {
		const ptr = shallowReactive(new Ptr(size, 0, value));
		this.allocated.insertEnd(ptr);
		return ptr;
	}

	public realloc<T extends AllocDisplay>(ptr: Ptr<T>, newSize: number, newVal: T): Ptr<T> {
		ptr;
		return new Ptr(0, newSize, newVal);
	}

	public free<T extends AllocDisplay | Dealloc>(ptr: Ptr<T>) {
		const ptrValue = ptr.v;
		ptr.isFree = true;

		if((ptrValue as Dealloc).dealloc !== undefined) {
			(ptrValue as Dealloc).dealloc();
		}
	}

	public resetExceptNull() {
		if(this.allocated.head.next) {
			this.allocated.head.next.next = null;
		}
	}
}

const allocator = new Allocator;
export const NULL = allocator.malloc<Null>(4, new Null);

export default allocator;
