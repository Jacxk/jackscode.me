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
        <v-icon :color="hasItem()(product) ? 'primary' : 'grey'">
          mdi-cart-plus
        </v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'Item',
  props: {
    product: Object
  },
  methods: {
    ...mapGetters(['hasItem']),
    ...mapActions(['sendSnackbar']),
    addToCart(item) {
      if (!this.hasItem()(item)) {
        this.$store.commit('add', item)
        this.sendSnackbar({ text: 'Item added to cart', color: 'success' })
      } else {
        this.$store.commit('remove', item)
        this.sendSnackbar({ text: 'Item removed from cart', color: 'error' })
      }
    }
  }
}
</script>
