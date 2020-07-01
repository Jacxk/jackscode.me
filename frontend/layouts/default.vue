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
      :value="snackbar.showing"
      :color="snackbar.color"
      :timeout="snackbar.timeout"
      :bottom="true"
      outlined
      @input="HIDE_SNACKBAR"
    >
      {{ snackbar.text }}
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
