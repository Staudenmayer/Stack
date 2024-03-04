import { useUserStore } from "#imports";

export default defineNuxtRouteMiddleware(async (to, from) => {
	const userStore = useUserStore();

	const publicPaths = ['/login', '/register'];
	if (publicPaths.includes(to.path)) return;

	const data = await useRequestFetch()("/api/user");
	if (data) {
		let user = {id: '', email: ''};
		user.id = data.id;
		user.email = data.username;
		userStore.user = user;
		console.warn(userStore.user)
	}
	else if (to.path === '/' && !userStore.isAuthenticated()){
		console.warn("asd")
		userStore.user = {id: '', email: ''};
		return navigateTo("/login");
	}
	else if (to.path !== from.path){
		console.warn("here")
		userStore.user = {id: '', email: ''};
		if(!userStore.isAuthenticated()){
			return navigateTo("/login");
		}
	}
	else {
		userStore.user = {id: '', email: ''};
	}
});

