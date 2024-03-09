<template>
  <div>
    <p>{{ user }}</p>
  </div>
</template>

<script lang="ts">
import { useUserStore } from "~/stores/user";

export default {
  data() {
    return {
      userStore: useUserStore(),
      user: { email: "", id: "" },
    };
  },
  mounted() {
    this.user = this.userStore.user;
  },
  methods: {},
};
</script>
