<template>
  <v-row>
    <v-col cols="12" xs="12" sm="12" md="9" xl="9">
      <v-card outlined>
        <v-list>
          <v-subheader class="center-text">Your Cart</v-subheader>
          <div v-if="this.$store.state.cart.length <= 0">
            <v-divider />
            <v-subheader>
              <span>
                Cart is empty. Go to the
                <nuxt-link to="/products">products</nuxt-link>
                page and add some things!
              </span>
            </v-subheader>
          </div>
          <template v-for="item in items">
            <div :key="item._id">
              <v-divider />

              <v-list-item :to="'/product/' + item._id" :ripple="false">
                <v-list-item-avatar>
                  <v-img :src="item.picture" />
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title v-text="item.name" />
                  <v-list-item-subtitle v-text="item.description" />
                </v-list-item-content>

                <v-list-item-action>
                  <v-btn icon @click.prevent="remove(item)">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </div>
          </template>
        </v-list>
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

export default {
  name: 'Cart',
  components: { HotItems },
  computed: {
    items() {
      return this.$store.state.cart
    }
  },
  methods: {
    ...mapActions(['sendSnackbar']),
    remove(item) {
      this.$store.commit('remove', item)
      this.sendSnackbar({ text: 'Item removed from cart', color: 'success' })
    }
  }
}
</script>

<style scoped></style>
