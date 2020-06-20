<template>
  <v-row>
    <v-col cols="12" sm="3">
      <v-card width="300px">
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
          Products Bought: {{ (user.products_bought || []).length }}
          <br />
          Products Rated: {{ (user.ratings_given || []).length }}
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" sm="9">
      <v-tabs v-model="tab" grow>
        <v-tab>Ratings</v-tab>
        <v-tab>Products</v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab">
        <v-tab-item>
          <v-card width="100%" height="100%">
            <v-card-text v-if="(user.ratings_given || []).length > 0">
              <v-list v-for="(i, product) in user.ratings_given" :key="i">
                <Rating :title="product.title" :rating="product.rating">
                  {{ product.content }}
                </Rating>
              </v-list>
            </v-card-text>
            <v-card-text v-else>
              No ratings given
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card width="100%" height="100%">
            <v-card-text v-if="(user.products_bought || []).length > 0">
              Theses are some products
            </v-card-text>
            <v-card-text v-else>
              No products bought
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-col>
  </v-row>
</template>

<script>
import Rating from '../../components/products/rating'
export default {
  name: 'Me',
  components: { Rating },
  middleware: 'auth',
  data() {
    return {
      tab: null
    }
  },
  computed: {
    user() {
      return this.$auth.user
    }
  }
}
</script>
