<template>
  <div>
    <v-row>
      <v-col>
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on">
              View As
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="changeProductView(0)">Card</v-list-item>
            <v-list-item @click="changeProductView(1)">List</v-list-item>
          </v-list>
        </v-menu>

        <v-btn v-if="hasRole('seller')" to="/products/create">
          Create
        </v-btn>
      </v-col>
    </v-row>
    <v-row align="stretch" justify="start" dense>
      <v-col v-if="products.length <= 0" cols="12">
        There are no products... Check back later!
      </v-col>
      <v-col
        v-for="(product, i) in products"
        :key="i"
        cols="12"
        :class="getProductView() !== 0 ? 'py-0' : ''"
        :xs="colsXs"
        :sm="colsSm"
        :md="colsMd"
        :lg="colsLg"
        :xl="colsXl"
      >
        <Item
          :product="product"
          :dense="getProductView() !== 0"
          divider
          top
          bottom
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Item from '../../components/products/item'

export default {
  components: { Item },
  async asyncData({ $axios }) {
    const products = await $axios.$get('/api/products')
    return { products }
  },
  data() {
    return {
      cols: {
        list: {
          xs: '12',
          sm: '12',
          md: '12',
          lg: '12',
          xl: '12'
        },
        card: {
          xs: '12',
          sm: '6',
          md: '4',
          lg: '3',
          xl: '2'
        }
      },
      products: []
    }
  },
  computed: {
    ...mapGetters('preferences', ['getProductView']),
    ...mapGetters(['hasRole']),
    colsXs() {
      return this.getProductView() !== 0 ? this.cols.list.xs : this.cols.card.xs
    },
    colsSm() {
      return this.getProductView() !== 0 ? this.cols.list.sm : this.cols.card.sm
    },
    colsMd() {
      return this.getProductView() !== 0 ? this.cols.list.md : this.cols.card.md
    },
    colsLg() {
      return this.getProductView() !== 0 ? this.cols.list.lg : this.cols.card.lg
    },
    colsXl() {
      return this.getProductView() !== 0 ? this.cols.list.xl : this.cols.card.xl
    }
  },
  methods: {
    ...mapActions('preferences', ['changeProductView'])
  }
}
</script>
