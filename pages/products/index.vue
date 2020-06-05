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
        <v-card
          :to="'/product/' + product._id"
          :ripple="false"
          height="100%"
          class="product-card"
          outlined
        >
          <v-img
            :src="product.picture"
            height="200px"
            class="white--text align-end"
            gradient="to bottom, rgba(0,0,0,0),rgba(0,0,0,.2), rgba(0,0,0,.8)"
          >
            <v-card-title>{{ product.name }}</v-card-title>
          </v-img>

          <v-card-text class="mb-10">
            <p>{{ product.description }}</p>
          </v-card-text>

          <v-card-actions class="product-card-action">
            <v-rating
              v-model="product.rating"
              :title="product.rating"
              color="yellow darken-3"
              background-color="grey darken-1"
              readonly
              half-increments
              hover
              dense
              small
              @click.prevent=""
            />

            <v-spacer />

            <v-btn icon @click.prevent="addToCart(product)">
              <v-icon :color="product.in_cart || false ? 'primary' : 'grey'"
                >mdi-cart-plus
              </v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
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

<style>
.product-card {
  position: relative;
}

.product-card-action {
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
}
</style>
<script>
export default {
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
