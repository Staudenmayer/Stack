<template>
    <v-responsive class="align-center text-center tw-w-dvw tw-h-dvh">
        <v-card class="ma-5 pa-5 w-25 mx-auto elevation-10">
            <div>Error:</div>
            {{ error.message }}
        </v-card>
    </v-responsive>
</template>

<script>
export default {
    props: {
        error: Object
    }
}
</script>
