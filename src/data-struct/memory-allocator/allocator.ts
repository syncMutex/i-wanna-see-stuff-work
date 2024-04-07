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
	static Size = 8;

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
	static Size = 8;

	size: number;
	start: number;
	next: Ptr<T> | null = null;
	isFree: boolean = false;
	
	v: T;

	constructor(size: number, start: number, value: T) {
		this.size = size;
		this.start = start;
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

type PtrType = Ptr<AllocDisplay>;

export class FreePtrVal<T extends AllocDisplay> implements AllocDisplay {
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

class Head<T extends AllocDisplay> extends Ptr<T> {
}

class AllocList {
	head: PtrType;
	tail: PtrType;

	constructor() {
		this.head = new Head(0, 0, new Null);
		this.tail = this.head;
		this.head.next = this.tail;
		delete this.head.size;
		delete this.head.v;
		delete this.head.start;
		delete this.head.isFree;
	}

	*iter() {
		let temp: null | PtrType = this.head.next;

		while(temp !== null) {
			yield temp;
			temp = temp.next;
		}
	}

	getPrevOf(ptr: PtrType): PtrType {
		let prev: ShallowReactive<PtrType> = this.head;

		while(prev.next !== ptr) {
			prev = prev.next as ShallowReactive<PtrType>;
		}

		return prev;
	}

	insertEnd(ptr: PtrType) {
		if(this.head === this.tail) {
			this.tail = ptr;
			this.head.next = this.tail;
			return;
		}

		ptr.start = this.tail.start + this.tail.size;
		this.tail.next = ptr;
		this.tail = ptr;
	}

	isEmpty(): boolean {
		return this.head.next === null;
	}
}

class FreeBlock {
	ptr: PtrType;
	next: FreeBlock | null = null;

	constructor(ptr: PtrType) {
		this.ptr = ptr;
	}
}

class HeadBlock extends FreeBlock {};

/*
	+--------+  +--------+  +--------+
	| node-1 |->| node-2 |->| node-3 |
	+--------+  +--------+  +--------+

	on FreeList.add(node-2)

	i am storing the prevPtr in FreeBlock

	+-------------------+
	| FreeBlock: node-1 |
	+-------------------+
*/

class FreeList {
	head: FreeBlock;

	constructor(headPtr: PtrType) {
		this.head = new HeadBlock(headPtr);
	}

	prevOfSize(size: number): FreeBlock | null {
		let temp: null | FreeBlock = this.head;

		while(temp.next !== null) {
			if(temp.next.ptr.size >= size) {
				return temp;
			}
			temp = temp.next;
		}
		
		return null;
	}

	deleteBlockViaPrev(prevBlock: FreeBlock) {
		if(prevBlock.next) {
			prevBlock.next = prevBlock.next.next;
		}
	}

	add(ptr: PtrType, prevPtr: PtrType) {
		const newBlock = new FreeBlock(ptr);
		newBlock.next = this.head.next;
		this.head.next = newBlock;
	}
}

class Allocator {
	allocated: ShallowReactive<AllocList>;
	freed: FreeList;

	constructor() {
		this.allocated = shallowReactive(new AllocList);
		this.freed = new FreeList(this.allocated.head);
		this.malloc<Null>(Null.Size, new Null);
	}

	private insertAfterBlock(prevBlock: FreeBlock, newPtr: PtrType) {
		const block = prevBlock.next as FreeBlock;
		const prev = this.allocated.getPrevOf(block.ptr);
		const prevSize = block.ptr.size;
		block.ptr.size -= newPtr.size;

		if(block.ptr.size === 0) {
			this.freed.deleteBlockViaPrev(prevBlock);
			newPtr.next = block.ptr.next;
			newPtr.start = block.ptr.start;
			prev.next = newPtr;
			if(newPtr.next === null) {
				this.allocated.tail = newPtr;
			}
		} else {
			const percent = 1 - (block.ptr.size / prevSize);
			let str = block.ptr.v.toString();
			let bytes = block.ptr.v.toBytes();
			str = str.slice(Math.floor(percent * str.length));
			(block.ptr.v as FreePtrVal<AllocDisplay>).stringRepr = str;
			(block.ptr.v as FreePtrVal<AllocDisplay>).bytes = bytes.slice(prevSize - block.ptr.size);

			newPtr.next = block.ptr;
			newPtr.start = block.ptr.start;
			block.ptr.start = newPtr.end();
			prev.next = newPtr;
		}
	}

	public malloc<T extends AllocDisplay>(size: number, value: T): ShallowReactive<Ptr<T>> {
		const ptr = shallowReactive(new Ptr(size, 0, value));
		const freeBlockPrev = this.freed.prevOfSize(ptr.size);

		if(freeBlockPrev === null) {
			this.allocated.insertEnd(ptr);
			return ptr;
		}

		this.insertAfterBlock(freeBlockPrev, ptr);

		return ptr;
	}

	public realloc<T extends AllocDisplay>(ptr: Ptr<T>, newSize: number, newVal: T): Ptr<T> {
		ptr;
		return new Ptr(0, newSize, newVal);
	}

	public free<T extends AllocDisplay | Dealloc>(ptr: Ptr<T>) {
		if(ptr.isFree) {
			throw Error("the pointer is already freed");
		}

		const ptrValue = ptr.v;
		const freePtrVal = new FreePtrVal(ptr.v as AllocDisplay);
		const prevPtr = this.allocated.getPrevOf(ptr as PtrType);

		ptr.isFree = true;

		// guranteed to be atleast head
		(prevPtr.next as any).v = freePtrVal;

		this.freed.add(ptr as PtrType, prevPtr);

		if((ptrValue as Dealloc).dealloc !== undefined) {
			(ptrValue as Dealloc).dealloc();
		}
	}

	public resetExceptNull() {
		if(this.allocated.head.next) {
			this.allocated = shallowReactive(new AllocList);
			this.freed = new FreeList(this.allocated.head);
			this.malloc<Null>(Null.Size, new Null);
		}
	}
}

const allocator = new Allocator;

export default allocator;
