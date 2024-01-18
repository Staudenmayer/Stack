<template>
  <div>
    <v-btn icon="mdi-logout" @click="logout"></v-btn>
  </div>
</template>

<script lang="ts">
export default {
  methods: {
    logout(){
      localStorage.removeItem("csrf-token");
      this.$axios.defaults.headers.common['X-CSRF-Token'] = "";
      navigateTo("/")
    }
  }
}
</script>

<style>

</style>