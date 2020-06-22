<template>
  <v-container>
    <v-row>
      <v-col cols="12" xs="12" sm="4" md="3" lg="3" xl="2">
        <v-row>
          <v-col>
            <v-card outlined width="100%">
              <v-img :src="product.picture" max-height="200px" contain />
              <v-divider />
              <v-card-title>
                <span>{{ product.name }}</span>
              </v-card-title>
              <v-card-text>
                <div>Description: {{ product.description }}</div>
                <div>Author: {{ product.author }}</div>
                <div>Version: {{ product.version }}</div>
                <div class="d-flex">
                  Rating:
                  <v-rating
                    v-model="product.rating"
                    color="yellow darken-3"
                    background-color="grey darken-1"
                    empty-icon="$ratingFull"
                    half-increments
                    readonly
                    small
                    dense
                  />
                </div>
              </v-card-text>
              <v-card-text>
                <div>
                  <v-btn
                    v-if="inCart(product)"
                    color="warning"
                    block
                    outlined
                    @click="removeCart(product)"
                  >
                    In cart
                  </v-btn>
                  <v-btn
                    v-else
                    color="success"
                    block
                    outlined
                    @click="addCart(product)"
                  >
                    Add to cart
                  </v-btn>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col>
            <HotItems />
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" xs="12" sm="8" md="8" lg="8" xl="9">
        <v-row>
          <v-col cols="12">
            <v-card outlined width="100%" height="100%">
              <v-card-text>
                <div v-html="$md.render(product.page_content)" />
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12">
            <v-card outlined width="100%" height="100%">
              <v-subheader>
                <span>Ratings</span>
                <v-spacer />

                <span>Leave a rating:</span>
                <v-rating
                  v-model="rating"
                  color="yellow darken-3"
                  background-color="grey darken-1"
                  empty-icon="$ratingFull"
                  small
                  dense
                  hover
                />
              </v-subheader>
              <v-divider />

              <v-expand-transition>
                <div v-if="rating > 0">
                  <v-list-item>
                    <v-textarea class="pt-8" outlined label="Message" />
                  </v-list-item>
                  <v-list-item>
                    <v-spacer />
                    <v-btn
                      class="mr-5"
                      color="error"
                      outlined
                      @click="rating = 0"
                    >
                      Cancel
                    </v-btn>
                    <v-btn color="success" outlined>
                      Submit
                    </v-btn>
                  </v-list-item>
                </div>
              </v-expand-transition>

              <v-list v-for="i in 5" :key="i">
                <v-divider />
                <Rating :title="'User ' + i" :rating="5"
                  >Rating #{{ i }}</Rating
                >
              </v-list>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import HotItems from '../../components/products/hot_items'
import Rating from '../../components/products/rating'

export default {
  name: 'Id',
  components: { Rating, HotItems },
  async asyncData({ params, $axios }) {
    try {
      const product = await $axios.$get(`/api/products/${params.id}`)
      return { product }
    } catch (e) {
      return { product: {}, error: e.message }
    }
  },
  data() {
    return {
      params: this.$route.params,
      product: {},
      rating: 0
    }
  },
  computed: {
    ...mapGetters({
      inCart: 'hasItem'
    })
  },
  methods: {
    ...mapActions({
      addCart: 'addToCart',
      removeCart: 'removeFromCart'
    })
  }
}
</script>

<style scoped></style>
