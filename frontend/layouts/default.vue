<template>
  <v-app>
    <navbar :site="site" />
    <v-main>
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
      text
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
import { mapState, mapMutations } from 'vuex'
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
  methods: {
    ...mapMutations(['HIDE_SNACKBAR'])
  },
  head() {
    return {
      title: 'Hello'
    }
  }
}
</script>

<style>
.add-product {
  position: fixed;
  bottom: 20px;
  right: 20px;
}
</style>
