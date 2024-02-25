import { useUserStore } from "~/stores/user";

export default defineNuxtRouteMiddleware(async (to, from) => {
    let publicPaths = ["/", "/register"];
    let nuxt = useNuxtApp();
    const userStore = useUserStore();
    await userStore.login(nuxt, {email: "", password: ""});
    if(!userStore.isAuthenticated && !publicPaths.includes(to.path)) {
        return navigateTo('/');
    }
    else if (userStore.isAuthenticated(nuxt) && to.path === '/') {
        return navigateTo('/home');
    }
});
//https://nuxt.com/docs/guide/directory-structure/middleware
