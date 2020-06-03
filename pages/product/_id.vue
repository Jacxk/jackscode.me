<template>
  <v-container> Hello and welcome to product #{{ params.id }} </v-container>
</template>

<script>
export default {
  name: 'Id',
  data() {
    return {
      params: this.$route.params
    }
  }
}
</script>

<style scoped></style>
