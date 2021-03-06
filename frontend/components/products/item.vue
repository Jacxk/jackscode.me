<template>
  <v-card
    v-if="!dense"
    :to="clickable ? '/products/' + product._id : ''"
    :ripple="false"
    :height="fullWidth ? '100%' : ''"
    class="product-card"
    color="theme_3"
    outlined
  >
    <VImage
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
    </VImage>

    <v-card-text class="mb-10">
      <p class="theme_text">
        {{ product.description || 'No description provided' }}
      </p>
      <v-divider class="pb-3" />
      <div class="more-info">
        <p>
          Author: <span>{{ product.author.username }}</span>
        </p>
        <p>Last Updated: <Timeago :datetime="getLastUpdate()" /></p>
        <div>
          <span>Minecraft Versions: </span>
          <v-chip
            v-for="(version, i) in sortedVersions"
            :key="i"
            small
            class="ma-1"
          >
            {{ version }}
          </v-chip>
        </div>
      </div>
    </v-card-text>

    <v-card-actions class="product-action ml-2">
      <v-subheader class="caption px-0">
        ({{ (product.ratings || '').length }})
      </v-subheader>
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
        v-if="
          buyable &&
            !owns(product._id) &&
            !bought(product._id) &&
            product.price > 0
        "
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
    <v-divider v-if="divider && top" inset />
    <v-list-item
      :to="clickable ? '/products/' + product._id : ''"
      :ripple="false"
    >
      <v-list-item-avatar>
        <VImage :src="product.picture" />
      </v-list-item-avatar>

      <v-list-item-content>
        <v-list-item-title class="d-flex flex-wrap justify-space-between">
          <span>
            {{ product.name || 'Untitled' }} - {{ price(product.price) }}
          </span>

          <div class="d-flex justify-center">
            <span class="grey--text text--lighten-1 caption pt-1">
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
    <v-divider v-if="divider && bottom" inset />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import VImage from '../extended/v-image'

export default {
  name: 'Item',
  components: { VImage },
  props: {
    product: {
      type: Object,
      default() {
        return {
          name: 'No name',
          price: 0.0,
          _id: null,
          rating: 0,
          description: 'No description',
          latest_version: '',
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
    ...mapGetters(['hasItem', 'bought', 'price']),
    sortedVersions() {
      return [...this.product.mc_versions].sort(
        (a, b) => String(a).split('.')[1] - String(b).split('.')[1]
      )
    }
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
    },
    owns() {
      const user = this.$auth.user || {}
      return this.product.author._id === user._id
    },
    getLastUpdate() {
      // eslint-disable-next-line camelcase
      const { latest_version, created_at } = this.product
      // eslint-disable-next-line camelcase
      return latest_version ? latest_version.created_at : created_at
    }
  }
}
</script>

<style lang="scss">
.product-card {
  position: relative;
  .product-action {
    position: absolute;
    bottom: 0px;
    right: 0;
    left: 0;
  }
}

.more-info {
  p {
    display: flex;
    justify-content: space-between;
    margin: 0;
  }
}
</style>
