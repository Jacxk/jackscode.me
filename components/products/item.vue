<template>
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
        <v-icon :color="product.in_cart || false ? 'primary' : 'grey'">
          mdi-cart-plus
        </v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'Item',
  props: {
    product: Object
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
