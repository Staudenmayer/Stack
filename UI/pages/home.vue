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
      const userStore = useUserStore();
      await userStore.logout(this);
      navigateTo("/")
    }
  }
}
</script>

<style>

</style>