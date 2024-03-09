<template>
  <v-responsive class="align-center text-center fill-height">
    <v-card class="ma-5 pa-5 w-25 mx-auto tw-min-w-fit">
      <v-img
        class="ma-5 mx-auto"
        contain
        height="300"
        width="300"
        src="/favicon.svg"
      ></v-img>
      <v-divider class="mt-5 mb-5"></v-divider>
      <v-btn
        v-if="!manualLogin"
        class="bg-primary tw-mb-5"
        elevated
        size="large"
        prepend-icon="mdi-google"
        :loading="googleLoading"
        block
        @click="login"
        >Login</v-btn
      >
      <v-btn
        v-if="!manualLogin"
        class="bg-primary"
        elevated
        size="large"
        prepend-icon="mdi-account"
        :loading="googleLoading"
        block
        @click="manualLogin = !manualLogin"
        >Login</v-btn
      >
      <v-form v-if="manualLogin" @submit.prevent="submit">
        <v-text-field
          v-model="email"
          label="Email"
          type="email"
          :rules="[rules.emailRequired, rules.emailCheck]"
          clearable
        ></v-text-field>
        <v-text-field
          v-model="password"
          label="Password"
          type="password"
          :hint="pwdHint"
          :rules="[rules.passwordRequired, rules.pwdCheck]"
          clearable
        ></v-text-field>
        <div class="tw-flex">
          <NuxtLink to="#" class="tw-mr-auto">Password Forgotten?</NuxtLink>
          <v-btn
            class="bg-primary tw-mr-5"
            elevated
            size="large"
            @click="manualLogin = !manualLogin"
            >Cancel</v-btn
          >
          <v-btn class="bg-primary" elevated type="submit" size="large"
            >Login</v-btn
          >
        </div>
      </v-form>
    </v-card>
    <a href="/login/google">test</a>
    <NuxtLink to="/register">Register</NuxtLink>
  </v-responsive>
</template>

<script lang="ts">
import { useUserStore } from "~/stores/user";
//import { googleAuthCodeLogin } from "vue3-google-login";

export default {
  data() {
    return {
      email: "" as string,
      password: "" as string,
      csrf_token: "" as string,
      pwdHint:
        "Your password must contain at least one upper case, lower case, number and symbol",
      rules: {
        emailRequired: (value: string) => !!value || "Email is required",
        passwordRequired: (value: string) => !!value || "Password is required",
        emailCheck: (value: string) =>
          !!/^\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b$/.exec(
            value,
          ) || "Your email is not valid",
        pwdCheck: (value: string) =>
          !!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=])[a-zA-Z\d@#$%^&+=]{8,}$/.exec(
            value,
          ) ||
          "Your password must contain at least one upper case, lower case, number and symbol",
      },
      manualLogin: false,
      googleLoading: false,
      userStore: useUserStore(),
    };
  },
  async mounted() {},
  methods: {
    submit: async function () {
      await this.userStore.login(this.email, this.password);
    },
    login: async function () {
      this.googleLoading = true;
      window.location.href = '/login/google';
      this.googleLoading = false;
    },
  },
};
</script>
