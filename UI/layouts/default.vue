<template>
  <v-app-bar v-if="userStore.isAuthenticated()" :elevation="2" rounded>
    <template v-slot:prepend>
      <v-app-bar-nav-icon @click="showDrawer = !showDrawer"></v-app-bar-nav-icon>
    </template>
    <v-app-bar-title>{{ $t('welcome') }}</v-app-bar-title>
    <template v-slot:append>
      <v-menu open-on-hover open-delay="0">
        <template v-slot:activator="{ props }">
          <v-btn class="bg-primary" color="text" v-bind="props">
            {{ locale }}
          </v-btn>
        </template>
        <v-list>
          <v-list-item v-for="(item, index) in languages" :key="index" @click="locale = item.value"
            class="tw-cursor-pointer">
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-btn icon="mdi-logout" class="ml-5" @click="logout"></v-btn>
    </template>
  </v-app-bar>
  <v-main class="fill-height ma-5">
    <v-navigation-drawer v-model="showDrawer" temporary>
      <v-list density="compact" nav>
        <v-list-item prepend-icon="mdi-folder" title="My Files" value="myfiles"></v-list-item>
        <v-list-item prepend-icon="mdi-account-multiple" title="Shared with me" value="shared"></v-list-item>
        <v-list-item prepend-icon="mdi-star" title="Starred" value="starred"></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <slot />
  </v-main>
  <v-footer></v-footer>
</template>

<script lang="ts" setup>
let { locale } = useI18n();
locale.value = locale.value.substring(0, 2);
</script>


<script lang="ts">
import { useUserStore } from "~/stores/user";
export default {
  data() {
    return {
      showDrawer: false,
      languages: [
        { value: 'en', title: "EN" },
        { value: 'de', title: "DE" }
      ],
      userStore: useUserStore()
    }
  },
  mounted() {

  },
  methods: {
    async logout() {
      await this.userStore.logout();
    }
  }
}
</script>