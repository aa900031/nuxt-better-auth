<script setup lang="ts">
useAuthClient()
const { user, error } = useAuthState()
</script>

<template>
	<p>User: {{ user === null ? 'null' : user }}</p>
	<p v-if="error">
		Session error
	</p>
</template>
