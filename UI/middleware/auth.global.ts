import { useUserStore } from "~/stores/user";

export default defineNuxtRouteMiddleware(async (to, from) => {
    let publicPaths = ["/login", "/register"];
    if(to.path === '/') return navigateTo('/login'); //default redirect to login page
    let nuxt = useNuxtApp();
    const userStore = useUserStore();
    await userStore.login(nuxt, {email: "", password: ""});
    if(!userStore.isAuthenticated && !publicPaths.includes(to.path)) {
        return navigateTo('/login');
    }
    else if (userStore.isAuthenticated(nuxt) && to.path === '/') {
        return navigateTo('/home');
    }
});
//https://nuxt.com/docs/guide/directory-structure/middleware
