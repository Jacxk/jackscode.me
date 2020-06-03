<template>
  <v-app>
    <navbar v-bind:site="site"></navbar>
    <v-content>
      <v-container>
        <nuxt/>
<!--        <v-btn @click="change">Click</v-btn>-->
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
  import Navbar from "./navbar";

  export default {
    head() {
      return {
        title: 'Hello'
      }
    },
    data(vm) {
      return {
        site: {
          name: "Jack's Store"
        },
        change() {

        }
      }
    },
    components: {Navbar},
  }
</script>
