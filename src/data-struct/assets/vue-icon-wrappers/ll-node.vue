<template>
	<svg width="128" height="128" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
	<g id="ll-node">
	<path id="stroke" d="M87.5 38V81H1V38H87.5ZM89.5 81V38H127V81H89.5Z" stroke="white" stroke-width="4"/>
	<path id="arrow-head" d="M121.909 58.5911L99.5487 71.2954L99.472 46.0229L121.909 58.5911Z" fill="white"/>
	</g>
	</svg>
</template>

<style scoped>
svg{
	transform: scale(1.7, 1.7);
}

svg.selected #stroke {
	stroke: var(--stroke-clr);
}

svg.selected #arrow-head{
	fill: var(--stroke-clr);
}
</style>
