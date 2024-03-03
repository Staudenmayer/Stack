<template>
	<h1>Hi, {{ user.email }}!</h1>
	<p>Your user ID is {{ user.id }}.</p>
	<form @submit.prevent="logout">
		<button>Sign out</button>
	</form>
</template>

<script lang="ts">
import { useUserStore } from "~/stores/user";

export default {
	data() {
		return {
			userStore: useUserStore(),
			user: { email: '', id: '' }
		}
	},
	mounted() {
		this.user = this.userStore.user;
	},
	methods: {
		logout() {
			this.userStore.logout();
		}
	}
}
</script>
