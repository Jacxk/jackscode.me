<template>
  <v-app>
    <navbar :site="site" />
    <v-content>
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
