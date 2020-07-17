<template>
  <v-row>
    <v-col cols="12" sm="12" md="3">
      <v-card color="theme_2" outlined>
        <v-img
          :src="user.avatar || 'https://via.placeholder.com/200'"
          height="300px"
          class="white--text align-end"
          gradient="to bottom, rgba(0,0,0,0),rgba(0,0,0,.2), rgba(0,0,0,.8)"
        >
          <v-card-title>{{ user.username }}</v-card-title>
        </v-img>
        <v-card-text>
          Join Date: {{ new Date(user.created_at).toLocaleDateString() }}
          <br />
          Products Bought: {{ orders.length }}
          <br />
          Products Rated: {{ user.ratings_given.length }}
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" sm="12" md="9">
      <v-tabs v-model="tab" grow background-color="theme_2">
        <v-tab>Ratings</v-tab>
        <v-tab>Products</v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab">
        <v-tab-item>
          <v-card width="100%" height="100%" color="theme_2" outlined>
            <div v-if="(ratings_given || []).length > 0">
              <v-list color="theme_2" class="py-0">
                <Rating
                  v-for="(rating, i) in sortDescending(ratings_given)"
                  :key="i"
                  :to="`/products/${rating.product._id}`"
                  :date="rating.created_at"
                  :title="rating.product.name"
                  :picture="rating.product.picture"
                  :rating="rating.stars"
                >
                  {{ rating.content }}
                </Rating>
              </v-list>
            </div>
            <v-card-text v-else>
              No ratings given
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card width="100%" height="100%" color="theme_2" outlined>
            <div v-if="hasBought()">
              <Item
                v-for="(product, i) in orders"
                :key="i"
                :product="product"
                dense
                divider
                top
              />
            </div>
            <v-card-text v-else>
              <span>
                You do not own anything. Try buying some products.
                <nuxt-link to="/products">products</nuxt-link>
              </span>
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex'
import Rating from '../../components/products/rating'
import Item from '../../components/products/item'

export default {
  name: 'Me',
  components: { Item, Rating },
  middleware: 'auth',
  async asyncData({ $axios, $auth }) {
    const ratings_given = await $axios.$get(
      `/api/ratings/user/${$auth.user._id}`
    )

    return { ratings_given }
  },
  data() {
    return {
      tab: null,
      orders: this.$auth.user.products_bought
    }
  },
  computed: {
    ...mapGetters(['sortDescending']),
    user() {
      return this.$auth.user
    }
  },
  methods: {
    hasBought() {
      return this.orders.length > 0
    }
  }
}
</script>
