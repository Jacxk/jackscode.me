<template>
  <v-card outlined>
    <v-subheader>Hot products</v-subheader>
    <v-divider />
    <v-list-item v-if="hotItems.length < 1">
      No items found...
    </v-list-item>

    <div v-else>
      <v-list-item v-if="horizontal">
        <v-row>
          <v-col
            v-for="item in hotItems"
            :key="item._id"
            cols="12"
            xs="12"
            sm="6"
            md="4"
            lg="3"
            xl="2"
          >
            <item class="item" :product="item" />
          </v-col>
        </v-row>
      </v-list-item>
      <v-list v-for="item in hotItems" v-else :key="item._id">
        <v-list-item :to="'/product/' + item._id" :ripple="false">
          <v-list-item-avatar>
            <v-img :src="item.picture" />
          </v-list-item-avatar>

          <v-list-item-content>
            {{ item.name }}
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </div>
  </v-card>
</template>

<script>
import Item from './item'
export default {
  name: 'HotItems',
  components: { Item },
  props: {
    horizontal: Boolean,
    scroll: Boolean
  },
  async fetch() {
    const ids = this.$store.state.hot
    const hotItems = []

    for (let i = 0; i < ids.length; i++) {
      const id = ids[i]
      const item = await this.$axios.$get(`/api/product/${id}`)
      hotItems.push(item)
    }

    this.hotItems = hotItems
  },
  data() {
    return { hotItems: [] }
  }
}
</script>

<style lang="scss"></style>
