<template>
  <v-container>
    <v-img :src="product.picture" />
    <h1>{{ JSON.stringify(product) }}</h1>
  </v-container>
</template>

<script>
export default {
  name: 'Id',
  async asyncData({ params, $axios }) {
    try {
      const product = await $axios.$get(`/api/product/${params.id}`)
      return { product }
    } catch (e) {
      return { error: e.message }
    }
  },
  data() {
    return {
      params: this.$route.params,
      product: {}
    }
  }
}
</script>

<style scoped></style>
