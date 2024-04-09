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

export class Garbage implements AllocDisplay {
	maxLen: number;

	constructor(maxLen: number) {
		this.maxLen = maxLen;
	}

    toBytes(): Array<string> {
		return new Array(this.maxLen).fill("00");
	}

    toString() {
		let s = "<empty block>";
		const rem = this.maxLen - s.length;
		return s.slice(0, Math.min(this.maxLen, s.length)) + " ".repeat(Math.max(rem, 0));
	}

    toDisplayableBlocks() {
		let s = "<empty block>";
		const rem = this.maxLen - s.length;
		return [s.slice(0, Math.min(this.maxLen, s.length)) + " ".repeat(Math.max(rem, 0))];
	}
}

export class Ptr<T extends AllocDisplay | Dealloc> implements AllocDisplay {
	static Size = 8;

	size: number;
	start: number;
	next: Ptr<T> | null = null;
	freeBlock: FreeBlock | null = null;
	
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

	mergeEnd(ptrVal: FreePtrVal<AllocDisplay>) {
		this.bytes.push(...ptrVal.toBytes());
		this.stringRepr += ptrVal.toString();
	}

	mergeStart(ptrVal: FreePtrVal<AllocDisplay>) {
		this.bytes.unshift(...ptrVal.toBytes());
		this.stringRepr = ptrVal.toString() + this.stringRepr;
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

type FreePtrType = Ptr<FreePtrVal<AllocDisplay>>;

class Head<T extends AllocDisplay> extends Ptr<T> {
}

class AllocList {
	head: PtrType;
	tail: PtrType;

	constructor() {
		this.head = new Head(0, 0, new Null);
		this.tail = this.head;
		this.head.next = this.tail;
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
	ptr: Ptr<FreePtrVal<AllocDisplay>>;
	next: FreeBlock | null = null;

	constructor(ptr: Ptr<FreePtrVal<AllocDisplay>>) {
		this.ptr = ptr;
	}
}

class HeadBlock extends FreeBlock {};

class FreeList {
	head: FreeBlock;

	constructor(headPtr: PtrType) {
		this.head = new HeadBlock(headPtr as Ptr<FreePtrVal<AllocDisplay>>);
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

	prevOfPtr(ptr: PtrType): FreeBlock | null {
		let temp: null | FreeBlock = this.head;

		while(temp.next !== null) {
			if(temp.next.ptr === ptr) {
				return temp;
			}
			temp = temp.next;
		}

		return null;
	}

	isNextPtrCanBeUsed(ptr: PtrType, newSize: number): boolean {
		return ptr.next !== null && ptr.next.freeBlock !== null && (newSize - ptr.size) <= ptr.next.size;
	}

	cutPtrContent(ptr: PtrType, prevSize: number) {
		const percent = 1 - (ptr.size / prevSize);
		let str = ptr.v.toString();
		let bytes = ptr.v.toBytes();
		(ptr.v as FreePtrVal<AllocDisplay>).stringRepr = str.slice(Math.floor(percent * str.length));
		(ptr.v as FreePtrVal<AllocDisplay>).bytes = bytes.slice(prevSize - ptr.size);
	}

	deleteNextOf(prevBlock: FreeBlock) {
		if(prevBlock.next) {
			prevBlock.next = prevBlock.next.next;
		}
	}

	deleteByPtr(ptr: PtrType) {
		const prevBlock = this.prevOfPtr(ptr);

		if(prevBlock && prevBlock.next) {
			prevBlock.next = prevBlock.next.next;
		}
	}

	// can-todo: store prevPtr to not lookup prevPtr everytime while searching ptr prev
	add(ptr: FreePtrType, prevPtr: PtrType): PtrType | null {
		if(prevPtr.freeBlock === null && (ptr.next === null || ptr.next?.freeBlock === null)) {
			const newBlock = new FreeBlock(ptr);
			newBlock.next = this.head.next;
			this.head.next = newBlock;
			ptr.freeBlock = newBlock;
			return null;
		}
		
		if(prevPtr.freeBlock !== null) {
			prevPtr.freeBlock.ptr.v.mergeEnd(ptr.v);
			prevPtr.size += ptr.size;
			prevPtr.next = ptr.next;
			
			if(ptr.next !== null && ptr.next.freeBlock !== null) {
				prevPtr.freeBlock.ptr.v.mergeEnd(ptr.next.v);
				prevPtr.size += ptr.next.size;
				prevPtr.next = ptr.next.next;
				
				if(prevPtr.freeBlock.next === ptr.next.freeBlock) {
					this.deleteNextOf(prevPtr.freeBlock);
				} else {
					this.deleteByPtr(ptr.next);
				}
				return prevPtr;
			}
		}

		if(ptr.next !== null && ptr.next.freeBlock !== null) {
			ptr.next.start = ptr.start;
			ptr.next.size += ptr.size;
			ptr.next.freeBlock.ptr.v.mergeStart(ptr.v);
			prevPtr.next = ptr.next;
		}

		return null;
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
			this.freed.deleteNextOf(prevBlock);
			newPtr.next = block.ptr.next;
			newPtr.start = block.ptr.start;
			prev.next = newPtr;
			if(newPtr.next === null) {
				this.allocated.tail = newPtr;
			}
		} else {
			this.freed.cutPtrContent(block.ptr, prevSize);

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

	private reallocGrow(ptr: PtrType, newSize: number, newVal: AllocDisplay): PtrType {
		const sizeDiff = newSize - ptr.size;
		
		if(ptr.next === null) {
			ptr.size = newSize;
			return ptr;
		}

		if(this.freed.isNextPtrCanBeUsed(ptr, newSize)) {
			const prevNextSize = ptr.next.size;
			ptr.next.start += sizeDiff;
			ptr.next.size -= sizeDiff;
			ptr.size = newSize;
			ptr.v = newVal;

			if(ptr.next.size === 0) {
				this.freed.deleteByPtr(ptr.next);
				ptr.next = ptr.next.next;
				if(ptr.next === null) {
					this.allocated.tail = ptr;
				}
			} else {
				this.freed.cutPtrContent(ptr.next, prevNextSize);
			}
		} else {
			const ptrValue = ptr.v;
			this.freeWithoutDealloc(ptr);
			return this.malloc(newSize, ptrValue);
		}

		return ptr;
	}

	private reallocShrink(ptr: PtrType, newSize: number, newVal: AllocDisplay): PtrType {
		if(newSize <= 0) {
			return ptr;
		}

		const sizeDiff = ptr.size - newSize;
		const freePtrStart = ptr.end() - sizeDiff;

		ptr.size = newSize;
		ptr.v = newVal;

		if(ptr.next?.freeBlock) {
			const freePtrVal: AllocDisplay = new FreePtrVal(new Garbage(ptr.next.size + sizeDiff));
			ptr.next.size += sizeDiff;
			ptr.next.start = freePtrStart;
			ptr.next.v = freePtrVal;
		} else {
			const freePtrVal: AllocDisplay = new FreePtrVal(new Garbage(sizeDiff));
			let freePtr = new Ptr(sizeDiff, freePtrStart, freePtrVal);

			freePtr.next = ptr.next;
			ptr.next = freePtr;

			const tail = this.freed.add(freePtr as Ptr<FreePtrVal<AllocDisplay>>, ptr);
			if(tail !== null) {
				this.allocated.tail = tail;
			}
		}

		return ptr;
	}

	public realloc<T extends AllocDisplay>(ptr: Ptr<T>, newSize: number, newVal: T): Ptr<T> {
		if(newSize > ptr.size) {
			return this.reallocGrow(ptr, newSize, newVal) as Ptr<T>;
		} else if(newSize < ptr.size) {
			return this.reallocShrink(ptr, newSize, newVal) as Ptr<T>;
		}
		return ptr;
	}

	public freeWithoutDealloc<T extends AllocDisplay | Dealloc>(ptr: Ptr<T>) {
		if(ptr.freeBlock) {
			throw Error("the pointer is already freed");
		}

		const freePtrVal = new FreePtrVal(ptr.v as AllocDisplay);
		const prevPtr = this.allocated.getPrevOf(ptr as PtrType);

		// guranteed to be atleast head
		(prevPtr.next as PtrType).v = freePtrVal;

		const tail = this.freed.add(ptr as Ptr<any>, prevPtr);
		if(tail !== null) {
			this.allocated.tail = tail;
		}
	}

	public free<T extends AllocDisplay | Dealloc>(ptr: Ptr<T>) {
		const ptrValue = ptr.v;
		this.freeWithoutDealloc(ptr);
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
