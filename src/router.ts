import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

import Sorting from "./sorting/components/TheBody.vue";
import Dsa from "./data-struct/components/TheBody.vue";
import RootRoute from "./root-route.vue";

const routes: Array<RouteRecordRaw> = [
	{ path: "/", component: RootRoute },
	{ path: "/sorting", component: Sorting },
	{ path: "/dsa", component: Dsa },
];

const router = createRouter({
	history: createWebHistory("/i-wanna-see-stuff-work/"),
	routes
});

export default router;
