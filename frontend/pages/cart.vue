<template>
  <v-row>
    <v-col cols="12" xs="12" sm="12" md="9" xl="9">
      <v-card outlined color="theme_2">
        <v-list color="theme_2">
          <v-subheader class="d-flex justify-space-between">
            <span>Your Cart</span>
            <span>Total: ${{ totalPrice }}</span>
          </v-subheader>
          <v-divider />
          <div v-if="cartEmpty()">
            <v-subheader>
              <span>
                Cart is empty. Go to the
                <nuxt-link to="/products">products</nuxt-link>
                page and add some things!
              </span>
            </v-subheader>
          </div>
          <template v-for="item in cart" v-else>
            <div :key="item._id">
              <Item deleteable :product="item" dense />
              <v-divider />
            </div>
          </template>
        </v-list>
        <v-card-text v-if="!cartEmpty()">
          <v-btn
            :disabled="loading"
            :loading="loading"
            text
            outlined
            @click.prevent="checkout"
          >
            Checkout
          </v-btn>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col class="button-outline" cols="12" xs="12" sm="12" md="3" xl="3">
      <HotItems />
    </v-col>
  </v-row>
</template>

<script>
import { mapActions } from 'vuex'
import HotItems from '../components/products/hot_items'
import Item from '../components/products/item'

export default {
  name: 'Cart',
  components: { Item, HotItems },
  async asyncData({ $axios, $auth, store }) {
    if ($auth.loggedIn) {
      const { cart } = await $axios.$get(`/api/users/${$auth.user._id}/cart`)
      store.dispatch('setCart', cart)
    }
  },
  data() {
    return { loading: false }
  },
  computed: {
    cart() {
      return this.$store.state.cart
    },
    totalPrice() {
      return this.cart.reduce((a, b) => a + b.price, 0)
    }
  },
  methods: {
    ...mapActions([
      'sendSnackbar',
      'removeFromCart',
      'setCart',
      'handleCheckout'
    ]),
    cartEmpty() {
      return this.cart.length < 1
    },
    async checkout() {
      if (!this.$auth.loggedIn) {
        await this.$router.push('/auth/login')
        return
      }
      this.loading = true
      await this.handleCheckout(this.totalPrice)
      await this.$router.push('/checkout')
    }
  }
}
</script>
