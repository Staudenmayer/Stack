import axios from 'axios';

export default defineNuxtPlugin((app) => {
    return {
        provide: {
            axios: axios
        }
    }
})
