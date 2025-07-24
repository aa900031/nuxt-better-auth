<script setup lang="ts">
const authClient = useAuthClient()
const { session, user } = useAuthState()
const { data, refresh, error } = useFetch('/api/check')

async function handleSignInClick() {
	await authClient.signIn.anonymous()
}

async function handleSignOutClick() {
	await authClient.signOut()
}

async function handleClickRefetch() {
	await refresh()
}
</script>

<template>
	<p>
		User: {{ user === null ? 'null' : user }}
	</p>
	<p>
		Session: {{ session === null ? 'null' : session }}
	</p>
	<button
		v-if="session == null"
		@click="handleSignInClick"
	>
		Sign In
	</button>
	<button
		v-else
		@click="handleSignOutClick"
	>
		Sign Out
	</button>
	<hr>
	<pre>
		<code
			v-if="error"
			style="color: red;"
			v-text="error"
		/>
		<code
			v-else
			v-text="data"
		/>
	</pre>
	<button @click="handleClickRefetch">
		Refetch by Check
	</button>
</template>
