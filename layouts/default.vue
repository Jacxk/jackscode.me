<template>
  <v-app>
    <navbar :site="site"></navbar>
    <v-content>
      <v-container>
        <nuxt />
        <!--        <v-btn @click="change">Click</v-btn>-->
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
