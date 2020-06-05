<template>
  <v-app>
    <v-content>
      <navbar :site="site" />
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
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
