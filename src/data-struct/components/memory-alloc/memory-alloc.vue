<script lang="ts" setup>
import { ref } from "vue";
import allocator from "../../memory-allocator/allocator";
import Select from "../../../common-components/select.vue";

enum Mode {
	Bytes = "bytes",
	String = "simplified"
}

const refreshToggle = ref(false);
const mode = ref(Mode.String);

function refresh() {
	refreshToggle.value = !refreshToggle.value;
}

</script>

<template>
<div id="memory-alloc" class="floating-panel">
	<div id="top-bar">
		<button @click="refresh" class="btn btn-nobg clr-blue">refresh</button>
		<Select
			:options="Mode"
			:onChange="(value) => mode = value as Mode"
			:value="mode"
		/>
	</div>
	<div id="alloc-container" class="scroll-bar" :key="String(refreshToggle)">
		<template v-if="mode === Mode.Bytes">
			<span
				v-for="(block, idx) in allocator.allocated" :key="idx"
				:class="['bytes', block.v.constructor.name, block.isFree ? 'freed' : '']"
			>
				<span v-for="b in block.v.toBytes()">{{b + " "}}</span>
			</span>
		</template>

		<template v-if="mode === Mode.String">
			<span 
				v-for="(block, idx) in allocator.allocated" :key="idx"
				:class="['simplified', block.v.constructor.name, block.isFree ? 'freed' : '']"
			>
				<span class="address">{{" " + block.toString() + " "}}</span>
				<span class="content">{{" " + block.v + " "}}</span>
			</span>
		</template>
	</div>
</div>
</template>

<style scoped>
@import "../css/common.css";

*{
	--chars: #0ba316;
	--str: #57c95e;
	--lnode: #8400ff;
	--null: #ffffff;
}

.Chars.simplified{
	background-color: var(--chars);
	color: white;
}

.Str.simplified{
	background-color: var(--str);
	color: black;
}

.ElementLLNode.simplified{
	background-color: var(--lnode);
	color: white;
}

.Null.simplified{
	background-color: var(--null);
	color: black;
}

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

#memory-alloc{
	position: absolute;
	width: 90%;
	height: 40%;
	bottom: 1%;
	z-index: 100;
	overflow: hidden;
	display: flex;
	flex-direction: column;
}

#top-bar{
	background-color: rgb(10, 10, 10);
	width: 100%;
	height: 2.5rem;
	display: flex;
	flex-direction: row;
	align-items: center;
	padding: 0.5rem;
}

#top-bar > * {
	margin-right: 1rem;
	min-height: 100%;
	height: 100%;
}

#alloc-container{
	height: 100%;
	overflow-y: auto;
	font-family: monospace;
	text-wrap: wrap;
	word-break: break-all;
	line-break: anywhere;
	white-space-collapse: break-spaces;
	padding: 0.5rem;
}

.bytes{
	color: white;
}

.bytes > span {
	display: inline-block;
	white-space: pre;
}

.simplified{
	display: inline;
	position: relative;
	border-radius: 5px;
	font-size: 0.8rem;
	line-height: 1.3em;
}

.address{
	display: none;
	opacity: 0;
	position: absolute;
	white-space: pre;
	pointer-events: none;
	border-radius: 5px;
	transition: all 0.2s;
}

.simplified:hover .address{
	display: inline-block;
	opacity: 1 !important;
	background-color: white;
	color: black;
	transform: scale(1.1);
	z-index: 100;
}

.bytes.freed{
	color: rgb(80, 80, 80);
}

.simplified.freed{
	background-color: rgb(80, 80, 80);
	color: grey;
	opacity: 0.4;
}

</style>
