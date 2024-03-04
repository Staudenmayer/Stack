<template>
	<h1>Hi, {{ user.email }}!</h1>
	<p>Your user ID is {{ user.id }}.</p>
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
	}
}
</script>
