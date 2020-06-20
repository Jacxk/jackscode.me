<template>
  <v-main>
    {{ $auth.user.username }}
  </v-main>
</template>

<script>
export default {
  middleware: 'auth',
  name: 'Me'
}
</script>
