<script setup lang="ts">
import allocator from '../../memory-allocator/allocator';
</script>

<template>
<div class="simplified-container text-wrap">
	<span 
		v-for="(block, idx) in allocator.allocated" :key="idx"
		:class="['simplified', block.v.constructor.name, block.isFree ? 'freed' : '']"
	>
		<span class="address">{{" " + block.toString() + " "}}</span>
		<span class="content">{{" " + block.v + " "}}</span>
	</span>
</div>
</template>

<style scoped>
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

.text-wrap{
	font-family: monospace;
	text-wrap: wrap;
	word-break: break-all;
	line-break: anywhere;
	white-space-collapse: break-spaces;
}

.simplified-container{
	height: max-content;
	padding-bottom: 0.5rem;
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

.simplified.freed{
	background-color: rgb(80, 80, 80);
	color: grey;
	opacity: 0.4;
}
</style>
