<template>
  <v-app>
    <navbar :site="site" />
    <v-main class="theme_1">
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
    <BottomNav class="hidden-sm-and-up" />

    <v-snackbar
      transition="slide-x-reverse-transition"
      :value="snackbar.showing"
      :color="snackbar.color"
      :timeout="snackbar.timeout"
      top
      right
      @input="HIDE_SNACKBAR"
    >
      {{ snackbar.text }}
      <template v-slot:action="{ attrs }">
        <v-btn dark text v-bind="attrs" @click="HIDE_SNACKBAR">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'
import Navbar from './navbar'
import BottomNav from './bottom_nav'

export default {
  components: { BottomNav, Navbar },
  data() {
    if (this.$auth.loggedIn) {
      this.$store.dispatch('setCart', this.$auth.user.cart)
    }
    return {
      site: {
        name: "Jack's Store"
      }
    }
  },
  computed: {
    ...mapState(['snackbar'])
  },
  mounted() {
    const token = window.localStorage.getItem('auth._token.local')
    this.$axios.setToken(token)
  },
  methods: {
    ...mapMutations(['HIDE_SNACKBAR']),
    ...mapActions(['sendSnackbar'])
  },
  head() {
    return {
      title: 'Hello'
    }
  }
}
</script>
