<template>
  <v-responsive class="align-center text-center fill-height">
    <v-card class="ma-5 pa-5 w-25 mx-auto">
      <v-img class="ma-5" contain height="300" src="/favicon.svg"></v-img>
      <v-form @submit.prevent="submit">
        <v-text-field v-model="email" label="Email" type="email" :rules="[rules.emailRequired, rules.emailCheck]"
          clearable></v-text-field>
        <v-text-field v-model="password" label="Password" type="password" :hint="pwdHint"
          :rules="[rules.passwordRequired, rules.pwdCheck]" clearable></v-text-field>
        <div class="d-flex">
          <NuxtLink to="#" class="me-auto">Password Forgotten?</NuxtLink>
          <v-btn class="bg-primary" elevated type="submit" size="large">Login</v-btn>
        </div>
      </v-form>
      <v-btn class="bg-primary" elevated size="large" prepend-icon="mdi-google" @click="login" :loading="googleLoading">Login</v-btn>
    </v-card>
    <NuxtLink to="/register">Register</NuxtLink>
  </v-responsive>
</template>

<script lang="ts">
import { googleSdkLoaded } from 'vue3-google-login';
import { useUserStore } from "~/stores/user";

export default {
  data() {
    return {
      email: '' as string,
      password: '' as string,
      csrf_token: '' as string,
      pwdHint: 'Your password must contain at least one upper case, lower case, number and symbol',
      rules: {
        emailRequired: (value: string) => !!value || 'Email is required',
        passwordRequired: (value: string) => !!value || 'Password is required',
        emailCheck: (value: string) => !!/^\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b$/.exec(value) || 'Your email is not valid',
        pwdCheck: (value: string) => !!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=])[a-zA-Z\d@#$%^&+=]{8,}$/.exec(value) || 'Your password must contain at least one upper case, lower case, number and symbol'
      },
      googleLoading: false,
      userStore: useUserStore()
    }
  },
  async mounted() {
    try {
      this.csrf_token = localStorage?.getItem('csrf-token') || '';
    } catch (error) {
      console.error(error);
      return;
    }
  },
  methods: {
    submit: async function () {
      try {
        await this.userStore.login(this, {email: this.email, password: this.password});
        navigateTo('/home');
      } catch (error) {
        console.error(error);
        return;
      }
      this.email = '';
      this.password = '';
    },
    login: function () {
      const vueObj = this;
      this.googleLoading = true;
      googleSdkLoaded(google => {
        google.accounts.oauth2
          .initCodeClient({
            client_id:
              '132131799753-e6ign1ps09pdglddbg0hk5rav89otu35.apps.googleusercontent.com',
            scope: 'email profile openid',
            redirect_uri: 'http://localhost:4444/home',
            callback: async response => {
              if (response.code) {
                try {
                  let user = await this.$axios.post('/api/google', {token: response.code});
                  vueObj.$user = user.data;
                  let csrf_token = user.headers['x-csrf-token'];
                  localStorage.setItem('csrf-token', csrf_token);
                  this.$axios.defaults.headers.common['X-CSRF-Token'] = csrf_token;
                  vueObj.googleLoading = false;
                  navigateTo('/home');
                } catch (error) {
                  vueObj.googleLoading = false;
                  console.error(error);
                }
              }
            }
          })
          .requestCode();
      });
      vueObj.googleLoading = false;
    }
  }
}
</script>
<style></style>