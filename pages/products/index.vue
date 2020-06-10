<template>
  <v-container>
    <v-slide-x-reverse-transition>
      <v-alert v-if="!!alert_message" type="success" outlined text dismissible>
        {{ alert_message }}
      </v-alert>
    </v-slide-x-reverse-transition>

    <h1 class="text-center">Product List</h1>
    <span v-if="products.length <= 0">
      There are no products... Check back later!
    </span>
    <v-row align="stretch" justify="start" dense>
      <v-col
        v-for="product in products"
        :key="product._id"
        cols="12"
        xs="12"
        sm="6"
        md="4"
        lg="3"
        xl="2"
      >
        <item :product="product" />
      </v-col>
    </v-row>

    <v-btn
      to="/products/create"
      class="add-product"
      elevation="5"
      fab
      large
      bottom
      left
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>
  </v-container>
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
      alert_message: '',
      products: []
    }
  },
  methods: {
    addToCart(item) {
      this.alert_message = `${item.name} added to cart!`
      this.$store.commit('toggle', item)
      setTimeout(() => (this.alert_message = false), 10 * 1000)
    }
  }
}
</script>
