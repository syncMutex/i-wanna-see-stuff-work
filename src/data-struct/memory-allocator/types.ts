import { ShallowReactive, ShallowRef, shallowReactive, shallowRef } from "vue";
import { numberToBytes } from "../utils";
import allocator, { AllocDisplay, Dealloc, DisplayableBlock, Ptr } from "./allocator";

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
		return this.chars.split("").map(v => v.charCodeAt(0).toString(16));
	}

    toString() {
		return ` chars [${this.chars.split("").map(v => `'${v}'`).join(", ")}] `;
	}

    toDisplayableBlocks() {
		return [` chars [${this.chars.split("").map(v => `'${v}'`).join(", ")}] `];
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
		return ` str { cap: ${this.charPtr.size}, len: ${this.charPtr.v.chars.length}, ptr: ${this.charPtr} } `;
	}

	toDisplayableBlocks() {
 		return [
			` str { cap: ${this.charPtr.size}, len: ${this.charPtr.v.chars.length}, ptr: `, { ptr: this.charPtr.toString() }, ` } `
		];
	}
}

export class Arr<T extends AllocDisplay | number> implements AllocDisplay {
	arr: ShallowReactive<Array<T>>;
	cap: number;

	static new<T extends AllocDisplay | number>(arr: Array<T>, dsize: number): Ptr<Arr<T>> {
		const obj = new Arr<T>(arr);
		return allocator.malloc(arr.length * dsize, obj);
	}

	constructor(arr: Array<T>) {
		this.arr = shallowReactive(arr);
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
		return ` arr: [${this.arr.map(a => a.toString()).join(", ")}] `;
	}

    toDisplayableBlocks() {
		let b = [];
		for(let a of this.arr) {
			b.push({ ptr: a.toString() } , ', ');
		}

		b.pop();

		return [` arr: [`, ...b, `] `];
	}
}

export class List<T extends AllocDisplay | number> implements AllocDisplay, Dealloc {
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

	dealloc() {
		allocator.free(this.arrPtr);
	}

	list(): Array<T> {
		return this.arrPtr.v.arr;
	}

	at(idx: number): T | undefined {
		return this.arrPtr.v.arr[idx];
	}

	setAt(idx: number, val: T) {
		this.arrPtr.v.arr[idx] = val;
	}

	set(val: Array<T>) {
		this.arrPtr.v.arr = val;
	}

	get length(): number {
		return this.arrPtr.v.arr.length;
	}

    toBytes(): Array<string> {
		return [
			...numberToBytes(this.arrPtr.v.cap),
			...numberToBytes(this.arrPtr.v.arr.length),
			...this.arrPtr.toBytes()
		];
	}

    toString(): string {
		return ` List { cap: ${this.arrPtr.v.cap}, length: ${this.arrPtr.v.arr.length}, ptr: ${this.arrPtr} } `;
	}

    toDisplayableBlocks() {
		return [` List { cap: ${this.arrPtr.v.cap}, length: ${this.arrPtr.v.arr.length}, ptr: `, { ptr: this.arrPtr.toString() }, ` } `];
	}
}

export class MapListMap<T extends AllocDisplay> implements AllocDisplay {
	map: ShallowReactive<Map<T, null>>;
	cap: number;

	static new<T extends AllocDisplay>(map: Map<T, null>, dsize: number): Ptr<MapListMap<T>> {
		const obj = new MapListMap<T>(map);
		return allocator.malloc(map.size * dsize, obj);
	}

	constructor(map: Map<T, null>) {
		this.map = shallowReactive(map);
		this.cap = map.size;
	}

    toBytes(): Array<string> {
		if(this.map.size === 0) {
			return [];
		}

		const temp = [...this.map.keys()];

		const arr: Array<string> = [];

		for(let a of temp) {
			arr.push(...(a as AllocDisplay).toBytes());
		}
		return arr;
	}

    toString(): string {
		return ` arr: [${[...this.map.keys()].map(a => a.toString()).join(", ")}] `;
	}

    toDisplayableBlocks(): Array<DisplayableBlock> {
		let b = [];
		for(let a of this.map.keys()) {
			b.push({ ptr: a.toString() } , ', ');
		}

		b.pop();

		return [` arr: [`, ...b, `] `];
	}
}

export class MapList<T extends AllocDisplay> implements AllocDisplay, Dealloc {
	static Size = 4 + 4 + 4;

	mapPtr: Ptr<MapListMap<T>>;

	static new<T extends AllocDisplay>(map: Map<T, null>, dsize: number): Ptr<MapList<T>> {
		const obj = new MapList<T>(map, dsize);
		const mem = allocator.malloc(List.Size, obj);
		return mem;
	}

	constructor(map: Map<T, null>, dsize: number) {
		this.mapPtr = MapListMap.new(map, dsize);
	}

	list(): Array<T> {
		return [...this.mapPtr.v.map.keys()];
	}

	first(): T | undefined {
		return this.mapPtr.v.map.keys().next().value;
	}

    toBytes(): Array<string> {
		return [
			...numberToBytes(this.mapPtr.v.cap),
			...numberToBytes(this.mapPtr.v.map.size),
			...this.mapPtr.toBytes()
		];
	}

	set(e: T) {
		this.mapPtr.v.map.set(e, null);
	}

	delete(e: T) {
		this.mapPtr.v.map.delete(e);
	}

	dealloc() {
		allocator.free(this.mapPtr);
	}

    toString(): string {
		return ` List { cap: ${this.mapPtr.v.cap}, length: ${this.mapPtr.v.map.size}, ptr: ${this.mapPtr} } `;
	}

    toDisplayableBlocks() {
		return [
			` List { cap: ${this.mapPtr.v.cap}, length: ${this.mapPtr.v.map.size}, ptr: `, { ptr: this.mapPtr.toString() }, ` } `
		];
	}
}
