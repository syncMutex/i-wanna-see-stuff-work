import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

import Sorting from "./sorting/components/TheBody.vue";
import Dsa from "./data-struct/components/TheBody.vue";

const routes: Array<RouteRecordRaw> = [
	{ path: "/sorting", component: Sorting },
	{ path: "/dsa", component: Dsa },
];

const router = createRouter({
	history: createWebHistory(),
	routes
});

export default router;
