<template>
  <v-main>
    <v-row>
      <v-col>
        <v-card>
          <div v-if="hasBought()">
            <v-card-title>Orders</v-card-title>
            <v-divider />
            <Item
              v-for="(product, i) in orders"
              :key="i"
              :product="product"
              dense
            />
          </div>
          <v-card-text v-else>
            <v-subheader>
              <span>
                You do not own anything. Try buying some products.
                <nuxt-link to="/products">products</nuxt-link>
              </span>
            </v-subheader>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-main>
</template>

<script>
import Item from '../../components/products/item'
export default {
  name: 'Orders',
  components: { Item },
  middleware: 'auth',
  data() {
    return {
      orders: this.$auth.user.products_bought
    }
  },
  methods: {
    hasBought() {
      return this.orders.length > 0
    }
  }
}
</script>

<style scoped></style>
