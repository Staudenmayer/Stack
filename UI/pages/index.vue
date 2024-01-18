<template>
  <v-responsive class="align-center text-center fill-height">
    <v-card class="ma-5 pa-5 w-25 mx-auto">
      <v-img class="ma-5" contain height="300" src="/favicon.svg"></v-img>
      <v-form @submit.prevent="submit">
        <v-text-field v-model="email" label="Email" clearable></v-text-field>
        <v-text-field v-model="password" label="Password" type="password" clearable></v-text-field>
        <v-btn class="bg-primary" block elevated type="submit" size="large">Login</v-btn>
      </v-form>
    </v-card>
  </v-responsive>
</template>

<script lang="ts">
  export default {
    data() {
      return {
        email: '' as string,
        password: '' as string,
        csrf_token: localStorage.getItem("csrf-token") || "" as string
      }
    },
    async mounted(){
      //if(!this.csrf_token) return;
      //this.$axios.defaults.headers.common['X-CSRF-Token'] = this.csrf_token;
      //try {
      //  let res = await this.$axios.get("/api/user");
      //  console.warn(res);
      //  this.$user = res.data;
      //  navigateTo("/home");
      //} catch (error: any) {
      //  if(error.response.status === 401) {
      //    this.csrf_token = "";
      //    localStorage.removeItem("csrf-token");
      //  }
      //  else {
      //    console.warn(error)
      //  }
      //}
    },
    methods: {
      submit: async function(){
        try {
          let res = await this.$axios.post("/api/login", {email: this.email, password: this.password});
          let csrf_token = res.headers['x-csrf-token'];
          localStorage.setItem("csrf-token", csrf_token);
          this.$axios.defaults.headers.common['X-CSRF-Token'] = csrf_token;
          this.$user = res.data;
          navigateTo("/home");
        } catch (error) {
          console.error(error);
          return;
        }
        this.email = '';
        this.password = '';
      }
    }
  }
</script>
<style></style>