import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', () => {
    const user = ref({id: '', email: ''});

    function isAuthenticated() {
        return user && user.value && user.value.id && user.value.email;
    }

    async function logout() {
        try {
            await $fetch("/api/logout", {
                method: "POST"
            });
            user.value = {id: '', email: ''};
            await navigateTo("/login");
        } catch (err) {
            if(err instanceof Error){
                console.error(err.message)
            }
        }
    }

    async function login(email: string, password: string) {
        try {
            await $fetch("/api/login", {
                method: "POST",
                body: {
                    email: email,
                    password: password
                }
            });
            await navigateTo("/");
        } catch (err) {
            if(err instanceof Error){
                console.error(err.message)
            }
        }
    }

    return {
        user,
        isAuthenticated,
        logout,
        login
    };
});
