<template>
  <v-card
    v-if="!dense"
    :to="'/products/' + product._id"
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
        class="px-2"
        background-color="grey darken-1"
        readonly
        half-increments
        hover
        dense
        small
        @click.prevent=""
      />

      <v-spacer />

      <v-subheader>${{ product.price }}</v-subheader>
      <v-tooltip v-if="!bought()(product._id)" bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on" @click.prevent="add(product)">
            <v-icon :color="hasItem()(product) ? 'primary' : 'grey'">
              {{ hasItem()(product) ? 'mdi-cart-off' : 'mdi-cart-plus' }}
            </v-icon>
          </v-btn>
        </template>
        <span>
          {{ hasItem()(product) ? 'Remove from cart' : 'Add to cart' }}
        </span>
      </v-tooltip>
    </v-card-actions>
  </v-card>

  <v-list-item v-else :to="'/products/' + product._id" :ripple="false">
    <v-list-item-avatar>
      <v-img :src="product.picture" />
    </v-list-item-avatar>

    <v-list-item-content>
      <v-list-item-title v-text="`${product.name} - $${product.price}`" />
      <v-list-item-subtitle v-text="product.description" />
    </v-list-item-content>

    <v-list-item-action v-if="deleteable">
      <v-btn icon @click.prevent="removeFromCart(product)">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-list-item-action>
  </v-list-item>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'Item',
  props: {
    product: {
      type: Object,
      default() {
        return {
          name: 'No name',
          price: 0.0,
          _id: null,
          rating: 0.0,
          description: 'No description'
        }
      }
    },
    dense: Boolean,
    deleteable: Boolean
  },
  methods: {
    ...mapGetters(['hasItem', 'bought']),
    ...mapActions(['sendSnackbar', 'addToCart', 'removeFromCart']),
    add(item) {
      if (!this.hasItem()(item)) {
        this.addToCart(item)
      } else {
        this.removeFromCart(item)
      }
    }
  }
}
</script>
