<script setup lang="ts">
const authClient = useAuthClient()
const { session, user } = useAuthState()

const hasAnonymousSignIn = typeof authClient.signIn.anonymous === 'function'

async function handleSignInClick() {
	await authClient.signIn.anonymous()
}

async function handleSignOutClick() {
	await authClient.signOut()
}
</script>

<template>
	<p>Anonymous Sign In: {{ hasAnonymousSignIn }}</p>
	<p>User: {{ user === null ? 'null' : user }}</p>
	<p>Session: {{ session === null ? 'null' : session }}</p>
	<button v-if="session == null" @click="handleSignInClick">
		Sign In
	</button>
	<button v-else @click="handleSignOutClick">
		Sign Out
	</button>
</template>
