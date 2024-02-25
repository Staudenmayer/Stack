import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', () => {
    const id = ref('');
    const email = ref('');

    const login = async ( nuxt: any, credentials: { email: string; password: string } ) => {
        if(!process.client || !localStorage) return
        if(isAuthenticated(nuxt)) return;
        try {
            nuxt.$axios.defaults.headers.common['X-CSRF-Token'] = localStorage.getItem('csrf-token');
            let res = await nuxt.$axios.get('/api/user');
            id.value = res.data.id;
            email.value = res.data.email;
            try { nuxt.provide('user', res.data); } catch (error) {}
            try { nuxt.$user = res.data; } catch (error) {}
            return;
        } catch (error) {
            id.value = '';
            email.value = '';
            console.error(error);
        }
        try {
            let res = await nuxt.$axios.post('/api/login', {email: credentials.email, password: credentials.password});
            nuxt.$axios.defaults.headers.common['X-CSRF-Token'] = res.data.csrf;
            localStorage.setItem('csrf-token', res.data.csrf);
            id.value = res.data.id;
            email.value = res.data.email;
            try { nuxt.provide('user', res.data); } catch (error) {}
            try { nuxt.$user = res.data; } catch (error) {}
        } catch (error) {
            id.value = '';
            email.value = '';
            console.error(error);
        }
    };

    const logout = async (nuxt: any) => {
        try {
            await nuxt.$axios.post('/api/logout');
        } catch (error) {
            console.error(error);
        }
        if(process.client && localStorage) localStorage.removeItem('csrf-token');
        id.value = '';
        email.value = '';
        nuxt.$axios.defaults.headers.common['X-CSRF-Token'] = '';
        navigateTo('/');
    };

    //const isAuthenticated = computed(() => email.value && id.value);
    const isAuthenticated = (nuxt: any) => {
        return nuxt && nuxt.$user && nuxt.$user.id && nuxt.$user.email && email.value && id.value && nuxt.$user.email === email.value && nuxt.$user.id === id.value;
    }

    return {
        id,
        email,
        login,
        logout,
        isAuthenticated,
    };
});
