<template>
  <v-row align="stretch" justify="start" dense>
    <v-col v-if="products.length <= 0" cols="12">
      There are no products... Check back later!
    </v-col>
    <v-col
      v-for="(product, i) in products"
      :key="i"
      cols="12"
      xs="12"
      sm="6"
      md="4"
      lg="3"
      xl="2"
    >
      <Item :product="product" />
    </v-col>
  </v-row>
</template>

<script>
import Item from '../../components/products/item'
export default {
  components: { Item },
  async asyncData({ $axios }) {
    const products = await $axios.$get('/api/products')
    return { products }
  },
  data() {
    return {
      products: []
    }
  }
}
</script>
