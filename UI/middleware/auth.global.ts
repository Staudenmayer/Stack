export default defineNuxtRouteMiddleware((to, from) => {
    let publicPaths = [
        '/',
        '/register'
    ]
    if(!publicPaths.includes(to.path)) {
        try {
            const nuxt = useNuxtApp();
            if(!localStorage) return navigateTo('/')
            let csrf_token = localStorage.getItem('csrf-token');
            if(!csrf_token) return navigateTo('/');
            if(nuxt.$user) return navigateTo(to.path);
            nuxt.$axios.defaults.headers.common['X-CSRF-Token'] = csrf_token;
            nuxt.$axios.get('/api/user')
            .then((res)=> {
                nuxt.provide('user', res.data);
            })
            .catch((err)=>{
                localStorage.removeItem('csrf-token');
                navigateTo('/')
            });
        } catch (error) {}
    }
})
//https://nuxt.com/docs/guide/directory-structure/middleware