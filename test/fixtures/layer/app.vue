<script setup lang="ts">
const authClient = useAuthClient()
const { session, user } = useAuthState()
</script>

<template>
	<p>Ping: {{ authClient.ping() }}</p>
	<p>User: {{ user === null ? 'null' : user }}</p>
	<p>Session: {{ session === null ? 'null' : session }}</p>
</template>
