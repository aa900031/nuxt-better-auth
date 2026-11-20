<script setup lang="ts">
const authClient = useAuthClient()
const { session, user } = useAuthState()
</script>

<template>
	<p>Ping: {{ authClient.ping() }}</p>
	<p>Foo: {{ authClient.foo() }}</p>
	<p>Bar: {{ authClient.bar() }}</p>
	<p>User: {{ user === null ? 'null' : user }}</p>
	<p>Session: {{ session === null ? 'null' : session }}</p>
</template>
