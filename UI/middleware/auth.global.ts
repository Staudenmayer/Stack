import { useUserStore } from "~/stores/user";

export default defineNuxtRouteMiddleware(async (to, from) => {
    let publicPaths = ["/", "/register"];
    let userStore = useUserStore();
    await userStore.login(useNuxtApp(), {email: "", password: ""});
    if(!userStore.isAuthenticated && !publicPaths.includes(to.path)) {
        return navigateTo('/');
    }
    else if (userStore.isAuthenticated && to.path === '/') {
        return navigateTo('/home');
    }
});
//https://nuxt.com/docs/guide/directory-structure/middleware
