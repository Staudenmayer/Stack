<template>
  <div>
    <v-btn icon="mdi-logout" @click="logout"></v-btn>
    {{ $user }}
  </div>
</template>

<script lang="ts">
import { useUserStore } from "~/stores/user";
export default {
  methods: {
    async logout(){
      //localStorage.removeItem("csrf-token");
      //this.$axios.defaults.headers.common['X-CSRF-Token'] = "";
      await useUserStore().logout(this);
      navigateTo("/")
    }
  }
}
</script>

<style>

</style>