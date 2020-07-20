<template>
  <v-card color="theme_2" outlined>
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
      <v-list v-else color="theme_2" class="py-0">
        <v-list-item
          v-for="item in hotItems"
          :key="item._id"
          :to="'/products/' + item._id"
          :ripple="false"
        >
          <v-list-item-avatar>
            <VImage :src="item.picture" />
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
import VImage from '../extended/v-image'
import Item from './item'

export default {
  name: 'HotItems',
  components: { VImage, Item },
  props: {
    horizontal: Boolean,
    scroll: Boolean,
    color: String
  },
  data() {
    return { hotItems: [] }
  },
  async mounted() {
    await this.$fireConfig.fetchAndActivate()
    const { _value } = await this.$fireConfig.getValue('hot_items')
    const items = JSON.parse(_value)

    const hotItems = []

    for (let i = 0; i < items.length; i++) {
      const id = items[i]
      const item = await this.$axios.$get(`/api/products/${id}`)
      if (item.error) {
        continue
      }
      hotItems.push(item)
    }

    this.hotItems = hotItems
  }
}
</script>

<style lang="scss"></style>
