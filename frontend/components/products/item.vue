<template>
  <v-card
    v-if="!dense"
    :to="clickable ? '/products/' + product._id : ''"
    :ripple="false"
    :height="fullWidth ? '100%' : ''"
    class="relative"
    outlined
  >
    <v-img
      :src="product.picture"
      height="200px"
      aspect-ratio="1"
      class="white--text align-end"
      gradient="to bottom, rgba(0,0,0,0),rgba(0,0,0,.2), rgba(0,0,0,.8)"
    >
      <v-card-title class="d-flex justify-space-between">
        <span>{{ product.name || 'Untitled' }}</span>
        <span>v{{ product.version || '0.0' }}</span>
      </v-card-title>
    </v-img>

    <v-card-text class="mb-8">
      <p>{{ product.description || 'No description provided' }}</p>
      <v-divider class="pb-3" />
      <p>Author: {{ product.author.username }}</p>
    </v-card-text>

    <v-card-actions class="absolute bottom-0">
      <span class="grey--text text--lighten-2 caption">
        ({{ (product.ratings || '').length }})
      </span>
      <v-rating
        v-if="ratings"
        v-model="product.rating"
        :title="product.rating"
        color="yellow darken-3"
        class="pb-1"
        background-color="grey darken-1"
        readonly
        half-increments
        hover
        dense
        small
      />

      <v-spacer />

      <v-subheader>{{ price(product.price) }}</v-subheader>
      <v-tooltip
        v-if="buyable && !bought(product._id) && product.price > 0"
        bottom
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            icon
            v-bind="attrs"
            v-on="on"
            @click.prevent="handleCart(product)"
          >
            <v-icon :color="hasItem(product) ? 'primary' : 'grey'">
              {{ hasItem(product) ? 'mdi-cart-off' : 'mdi-cart-plus' }}
            </v-icon>
          </v-btn>
        </template>
        <span>
          {{ hasItem(product) ? 'Remove from cart' : 'Add to cart' }}
        </span>
      </v-tooltip>
    </v-card-actions>
  </v-card>

  <div v-else>
    <v-divider v-if="divider && top" />
    <v-list-item
      :to="clickable ? '/products/' + product._id : ''"
      :ripple="false"
    >
      <v-list-item-avatar>
        <v-img :src="product.picture" />
      </v-list-item-avatar>

      <v-list-item-content>
        <v-list-item-title class="d-flex flex-wrap justify-space-between">
          <span>
            {{ product.name || 'Untitled' }} - {{ price(product.price) }}
          </span>

          <div class="d-flex justify-center">
            <span class="grey--text text--lighten-2 caption pt-1">
              ({{ (product.ratings || '').length }})
            </span>
            <v-rating
              v-if="ratings"
              v-model="product.rating"
              :title="product.rating"
              color="yellow darken-3"
              background-color="grey darken-1"
              readonly
              half-increments
              hover
              dense
              small
            />
          </div>
        </v-list-item-title>
        <v-list-item-subtitle>
          {{ product.description || 'No description provided' }}
        </v-list-item-subtitle>
      </v-list-item-content>

      <v-list-item-action v-if="deleteable">
        <v-btn icon @click.prevent="handleCart(product)">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-list-item-action>
    </v-list-item>
    <v-divider v-if="divider && bottom" />
  </div>
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
          description: 'No description',
          version: '0.0.0'
        }
      }
    },
    dense: Boolean,
    deleteable: Boolean,
    divider: Boolean,
    top: Boolean,
    bottom: Boolean,
    clickable: {
      type: Boolean,
      default: true
    },
    ratings: {
      type: Boolean,
      default: true
    },
    buyable: {
      type: Boolean,
      default: true
    },
    fullWidth: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    ...mapGetters(['hasItem', 'bought', 'price'])
  },
  methods: {
    ...mapActions(['sendSnackbar', 'addToCart', 'removeFromCart']),
    handleCart(item) {
      if (!this.hasItem(item)) {
        this.addToCart(item)
        this.$emit('add', item)
      } else {
        this.removeFromCart(item)
        this.$emit('remove', item)
      }
    }
  }
}
</script>
