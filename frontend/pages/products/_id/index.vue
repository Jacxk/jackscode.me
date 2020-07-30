<template>
  <v-row>
    <v-col cols="12" xs="12" sm="4" md="3" lg="3" xl="2">
      <v-row>
        <v-col cols="12">
          <v-card outlined width="100%" class="editable" color="theme_2">
            <VImage :src="product.picture" height="200px" />
            <v-divider />
            <v-card-title>
              <span>{{ product.name }}</span>
            </v-card-title>

            <div v-if="owns() && !editing_product" class="edit">
              <v-tooltip left>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn v-bind="attrs" icon v-on="on" @click="editProduct">
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                </template>
                <span>Edit Product</span>
              </v-tooltip>
            </div>
            <v-card-text>
              <div>Price: {{ price(product.price) }}</div>
              <div>Description: {{ product.description }}</div>
              <div>Author: {{ (product.author || {}).username }}</div>
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
              <div v-if="buyable()">
                <v-btn
                  v-if="hasItem(product)"
                  color="warning"
                  block
                  outlined
                  @click="removeFromCart(product)"
                >
                  In cart
                </v-btn>
                <v-btn
                  v-else
                  color="success"
                  block
                  outlined
                  @click="addToCart(product)"
                >
                  Add to cart
                </v-btn>
              </div>
              <div v-else>
                <v-btn
                  color="primary"
                  block
                  outlined
                  @click="downloadFile(product.latest_version)"
                >
                  Download
                </v-btn>
                <v-btn
                  v-if="owns()"
                  class="mt-3"
                  color="secondary"
                  block
                  outlined
                  :to="`/products/${product._id}/update`"
                >
                  Update
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12">
          <HotItems />
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="12" xs="12" sm="8" md="8" lg="8" xl="9">
      <v-row>
        <v-col cols="12">
          <v-tabs v-model="tab" background-color="theme_2" grow>
            <v-tab>Information</v-tab>
            <v-tab>Versions</v-tab>
            <v-tab-item>
              <v-card width="100%" height="100%" color="theme_2" outlined>
                <v-divider />
                <v-card-text class="editable">
                  <div v-if="owns() && !editing_content" class="edit">
                    <v-tooltip left>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          v-bind="attrs"
                          icon
                          v-on="on"
                          @click="editContent"
                        >
                          <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                      </template>
                      <span>Edit Content</span>
                    </v-tooltip>
                  </div>
                  <div
                    v-if="!editing_content"
                    @dblclick="editContent"
                    v-html="$md.render(product.page_content)"
                  />
                  <div v-else>
                    <v-tabs background-color="theme_3" grow>
                      <v-tab>Edit</v-tab>
                      <v-tab>Preview</v-tab>
                      <v-tab-item class="theme_2">
                        <v-textarea
                          v-model="edit_content"
                          background-color="theme_2"
                          outlined
                          auto-grow
                        />
                      </v-tab-item>
                      <v-tab-item class="theme_2">
                        <v-card-text
                          v-html="$md.render(edit_content || 'No content...')"
                        />
                      </v-tab-item>
                    </v-tabs>
                    <v-btn color="error" text outlined @click="cancelContent">
                      Cancel
                    </v-btn>
                    <v-btn
                      color="success"
                      text
                      outlined
                      :loading="loading"
                      :disabled="loading"
                      @click="saveContent"
                    >
                      Save
                    </v-btn>
                  </div>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <v-card
                v-if="(product.versions || '').length < 1"
                color="theme_2"
                outlined
              >
                <v-divider />
                <v-card-text>
                  There are no older versions right now... Come back later!
                </v-card-text>
              </v-card>
              <v-card
                v-for="(version, i) in sortDescending(product.versions)"
                :key="i"
                width="100%"
                height="100%"
                color="theme_2"
                outlined
              >
                <v-divider />
                <v-card-title>{{ version.title }}</v-card-title>
                <v-card-subtitle>
                  <Timeago :datetime="version.created_at" auto-update />
                </v-card-subtitle>
                <v-card-text>
                  {{ version.change_log }}
                </v-card-text>
                <v-card-actions class="d-flex justify-space-between">
                  <v-subheader> v{{ version.version }} </v-subheader>
                  <v-btn
                    v-if="owns() || bought(product._id)"
                    icon
                    @click="downloadFile(version._id)"
                  >
                    <v-icon>mdi-download</v-icon>
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-tab-item>
          </v-tabs>
        </v-col>
        <v-col cols="12">
          <v-card width="100%" height="100%" color="theme_2" outlined>
            <v-subheader>
              <span>Ratings</span>
              <v-spacer />

              <span>Leave a rating:</span>
              <v-rating
                v-model="stars"
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
              <div v-if="stars > 0">
                <v-list-item>
                  <v-textarea
                    v-model="rating_content"
                    class="pt-8"
                    label="Message"
                    hint="Say something nice!"
                    outlined
                  />
                </v-list-item>
                <v-list-item>
                  <v-spacer />
                  <v-btn class="mr-5" color="error" outlined @click="stars = 0">
                    Cancel
                  </v-btn>
                  <v-btn color="success" outlined @click="sendRating">
                    Submit
                  </v-btn>
                </v-list-item>
                <v-divider />
              </div>
            </v-expand-transition>

            <v-card
              v-if="(product.ratings || '').length < 1"
              color="theme_2"
              outlined
            >
              <v-card-text>
                No ratings found for this product...
              </v-card-text>
            </v-card>
            <v-list v-else color="theme_2" class="py-0">
              <Rating
                v-for="(rating, i) in sortDescending(product.ratings)"
                :key="i"
                :picture="rating.created_by.avatar"
                :title="rating.created_by.username"
                :rating="rating.stars"
                :date="rating.created_at"
              >
                {{ rating.content }}
              </Rating>
            </v-list>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import HotItems from '../../../components/products/hot_items'
import Rating from '../../../components/products/rating'
import VImage from '../../../components/extended/v-image'

export default {
  name: 'Id',
  components: { VImage, Rating, HotItems },
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
      loading: false,
      editing_content: false,
      editing_product: false,
      tab: null,
      params: this.$route.params,
      product: {},
      stars: 0,
      rating_content: '',
      edit_content: ''
    }
  },
  computed: {
    ...mapGetters(['hasItem', 'bought', 'price', 'sortDescending'])
  },
  methods: {
    ...mapActions(['addToCart', 'removeFromCart', 'sendSnackbar']),
    buyable() {
      return (
        !this.owns() && !this.bought(this.product._id) && this.product.price > 0
      )
    },
    owns() {
      const user = this.$auth.user || {}
      return this.product.author._id === user._id
    },
    async downloadFile(version) {
      try {
        this.sendSnackbar({ text: 'Downloading...', color: 'warning' })
        const { data, headers } = await this.$axios.get(
          `/api/products/${this.product._id}/download`,
          {
            params: { version },
            responseType: 'blob'
          }
        )
        const url = window.URL.createObjectURL(new Blob([data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', headers['file-name'])
        document.body.appendChild(link)
        link.click()
        link.remove()
      } catch (e) {
        this.sendSnackbar({ text: 'Internal error', color: 'error' })
      }
    },
    async sendRating() {
      try {
        const { data } = await this.$axios.put(
          `/api/ratings/product/${this.product._id}/`,
          {
            stars: this.stars,
            content: this.rating_content,
            version: this.product.latest_version,
            product: this.product._id
          }
        )

        data.created_by = this.$auth.user

        this.product.ratings.push(data)
        this.product.rating = data.overall_rating
        this.rating_content = ''
        this.stars = 0

        this.sendSnackbar({
          text: 'Rating submitted. Thank you!',
          color: 'success'
        })
      } catch {}
    },
    editContent() {
      if (!this.$auth.loggedIn || !this.owns()) return
      this.edit_content = this.product.page_content
      this.editing_content = true
    },
    async saveContent() {
      this.loading = true

      try {
        await this.$axios.$patch(`/api/products/${this.product._id}`, {
          page_content: this.edit_content
        })

        this.product.page_content = this.edit_content
        this.editing_content = false
        this.sendSnackbar({
          text: 'Info edited successfully!',
          color: 'success'
        })
      } catch {}

      this.loading = false
    },
    cancelContent() {
      this.edit_content = this.product.page_content
      this.editing_content = false
    },
    editProduct() {},
    saveProduct() {},
    cancelProduct() {}
  }
}
</script>

<style lang="scss">
.editable {
  position: relative;
  .edit {
    display: none;
    position: absolute;
    right: 0;
    top: 0;
  }
  &:hover .edit {
    display: block;
  }
}
</style>
