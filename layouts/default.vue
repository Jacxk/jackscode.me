<template>
  <v-app>
    <v-content>
      <navbar :site="site" />
      <v-container>
        <nuxt />
      </v-container>
    </v-content>

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
      title: 'Hello',
      script: [
        {
          src: 'https://www.gstatic.com/firebasejs/7.15.1/firebase-app.js',
          body: true
        },
        {
          src:
            'https://www.gstatic.com/firebasejs/7.15.1/firebase-analytics.js',
          body: true
        },
        {
          src:
            'https://www.gstatic.com/firebasejs/7.15.1/firebase-remote-config.js',
          body: true
        },
        {
          src: '/firebase.js',
          body: true
        }
      ]
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
