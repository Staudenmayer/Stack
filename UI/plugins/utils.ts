import axios from 'axios';

export default defineNuxtPlugin((app) => {
    app.vueApp.config.globalProperties.$user = {};
    return {
        provide: {
            axios: axios
        }
    }
})
