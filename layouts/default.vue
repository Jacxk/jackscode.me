<template>
  <v-app>
    <v-main>
      <navbar :site="site" />
      <v-container>
        <nuxt />
      </v-container>
    </v-main>

    <v-snackbar
      :value="snackbar.showing"
      :color="snackbar.color"
      :timeout="snackbar.timeout"
      :bottom="true"
      @input="hideSnackbar"
    >
      {{ snackbar.text }}
      <v-btn dark text @click="hideSnackbar">
        Close
      </v-btn>
    </v-snackbar>
  </v-app>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import Navbar from './navbar'
export default {
  components: { Navbar },
  data() {
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
    ...mapMutations(['hideSnackbar'])
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
