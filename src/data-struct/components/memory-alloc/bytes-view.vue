<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import allocator from "../../memory-allocator/allocator";
import { numberToHex } from "../../utils";
import { computed } from "@vue/reactivity";

const bytesContainer = ref<null | HTMLDivElement>(null);
const incBy = ref<number>(0);
const countOfRows = ref<number>(0);
const bytes = computed<Array<string>>(() => {
	const b: Array<string> = ["0x00000000"];
	for(let i = 1, count = incBy.value; i < countOfRows.value; i++, count += incBy.value) {
		b.push(`0x${numberToHex(count)}`)
	}
	return b;
});

function createDebouncer(fn: Function, delay: number) {
	let timeout: number;
	return () => {
		clearTimeout(timeout);
		timeout = setTimeout(fn, delay);
	}
}

const debouncedCalcBytesInc = createDebouncer(calcBytesInc, 200);

watch(allocator.allocated, calcBytesInc, { flush: "post" })

onMounted(() => {
	window.addEventListener("resize", debouncedCalcBytesInc);

	calcBytesInc();

	return () => {
		window.removeEventListener("resize", debouncedCalcBytesInc);
	}
})

function calcBytesInc() {
	const container = bytesContainer.value;
	if(container === null) {
		return;
	}
	const firstBlock = container.children[0];
	if(firstBlock === undefined) {
		return;
	}
	const firstByte = firstBlock.children[0];
	if(firstByte === undefined) {
		return;
	}

	const containerHeight = container.scrollHeight;
	const containerWidth = container.clientWidth;
	const firstByteHeight = firstByte.clientHeight;
	const firstByteWidth = firstByte.clientWidth;

	incBy.value = Math.floor(containerWidth / firstByteWidth);
	countOfRows.value = Math.floor(containerHeight / firstByteHeight);
}

</script>

<template>
<div id="bytes-label-container">
	<span v-for="(byte, idx) in bytes" :key="idx">
		<span>{{byte + " "}}</span>
	</span>
</div>

<div ref="bytesContainer" id="bytes-container">
	<span
		v-for="(block, idx) in allocator.allocated" :key="idx"
		:class="['bytes', block.v.constructor.name, block.isFree ? 'freed' : '']"
	>
		<span v-for="b in block.v.toBytes()">{{b + " "}}</span>
	</span>
</div>
</template>

<style scoped>
.Chars.bytes{
	color: var(--chars);
}

.Str.bytes{
	color: var(--str);
}

.ElementLLNode.bytes{
	color: var(--lnode);
}

.Null.bytes{
	color: var(--null);
}

.bytes.freed{
	color: rgb(80, 80, 80);
}

.bytes {
	color: white;
	font-family: monospace;
}

.bytes > span {
	display: inline-block;
	white-space: pre;
	font-size: 1rem;
}

#bytes-label-container > span{
	color: white;
	font-family: monospace;
	display: inline-block;
	white-space: pre;
	font-size: 1rem;
}

#bytes-label-container{
	flex-basis: 20ch;
}

#bytes-container, #bytes-label-container{
	height: max-content;
}

</style>
