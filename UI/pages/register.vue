<template>
  <v-responsive class="text-center fill-height">
    <v-card class="ma-5 pa-5 w-50 mx-auto">
      <div class="text-h1 mb-5">Register</div>
      <v-form @submit.prevent="register">
        <v-text-field
          v-model="username"
          label="Username"
          type="username"
        ></v-text-field>
        <v-text-field
          v-model="email"
          label="Email"
          type="email"
          :rules="[rules.emailRequired, rules.emailCheck]"
        ></v-text-field>
        <v-text-field
          v-model="password"
          label="Password"
          type="password"
          :rules="[rules.passwordRequired, rules.pwdCheck]"
        ></v-text-field>
        <v-btn class="bg-primary" elevated type="submit" size="large"
          >Register</v-btn
        >
      </v-form>
    </v-card>
  </v-responsive>
</template>

<script lang="ts">
export default {
  data() {
    return {
      username: "" as string,
      email: "" as string,
      password: "" as string,
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
    };
  },
  methods: {
    async register() {
      try {
        await $fetch("/api/register", {
          method: "POST",
          body: {
            email: this.email,
            password: this.password,
            username: this.username,
          },
        });
        await navigateTo("/");
      } catch (err) {
        if (err instanceof Error) {
          console.error(err.message);
        }
      }
    },
  },
};
</script>
