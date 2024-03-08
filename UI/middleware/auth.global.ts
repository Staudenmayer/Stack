import { useUserStore } from "#imports";

export default defineNuxtRouteMiddleware(async (to, from) => {
	const userStore = useUserStore();

	const publicPaths = ['/login', '/register'];
	if (publicPaths.includes(to.path)) return;

	const data = await useRequestFetch()("/api/user");
	if (data) {
		userStore.user = data;
	}
	else if (to.path === '/' && !userStore.isAuthenticated()){
		userStore.user = {id: '', email: ''};
		return navigateTo("/login");
	}
	else if (to.path !== from.path){
		userStore.user = {id: '', email: ''};
		if(!userStore.isAuthenticated()){
			return navigateTo("/login");
		}
	}
	else {
		userStore.user = {id: '', email: ''};
	}
});

