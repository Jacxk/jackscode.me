<template>
  <v-form v-model="valid" autocomplete="off" @submit.prevent="create">
    <v-container>
      <v-row>
        <v-col xs="12" sm="7" md="8" lg="8" xl="8">
          <v-card color="theme_2">
            <v-card-text>
              <v-text-field
                v-model="product.name"
                :counter="20"
                hint="Add an attractive name"
                label="Name"
                outlined
                required
              />

              <v-text-field
                v-model="product.price"
                label="Price"
                hint="Something reasonable..."
                type="number"
                min="0.00"
                max="20.00"
                step="0.01"
                outlined
                required
              />

              <v-file-input
                v-model="product.file"
                label="File"
                prepend-icon=""
                outlined
                show-size
                counter
                @change="product.file = $event"
              />

              <v-file-input
                v-model="product.picture_file"
                label="Image"
                prepend-icon=""
                outlined
                show-size
                counter
                @change="showPicture"
              />

              <v-text-field
                v-model="product.version"
                label="Version"
                hint="Use something like 1.0"
                outlined
                required
              />

              <v-select
                v-model="product.mc_versions"
                :items="mc_versions"
                label="Minecraft Versions"
                chips
                multiple
                outlined
              />

              <v-textarea
                v-model="product.description"
                label="Description"
                hint="Brief description of the product"
                :counter="300"
                outlined
                required
              />

              <v-textarea
                v-model="product.page_content"
                label="Page Content"
                hint="This is the Overview of your product. Use Markdown here! :D"
                auto-grow
                outlined
                required
              />

              <v-btn
                type="submit"
                :loading="loading"
                :disabled="loading"
                outlined
              >
                Save
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" xs="12" sm="5" md="4" lg="4" xl="4">
          <v-toolbar-title>Product Card Preview</v-toolbar-title>
          <Item
            :product="product"
            :buyable="false"
            :clickable="false"
            :full-width="false"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-card color="theme_2">
            <v-card-title>Page Content Preview</v-card-title>
            <v-divider />
            <v-card-text
              v-html="$md.render(product.page_content || 'No content...')"
            />
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
import { mapActions } from 'vuex'
import Item from '../../components/products/item'

export default {
  name: 'Create',
  components: { Item },
  middleware: ['auth', 'seller'],
  data() {
    return {
      loading: false,
      valid: false,
      mc_versions: [...Array(9).keys()].map((i) => `1.${i + 8}`),
      product: {
        author: {
          username: this.$auth.user.username
        },
        latest_version: {
          created_at: Date.now()
        },
        name: '',
        version: '',
        mc_versions: [],
        description: '',
        page_content: '',
        picture: '',
        price: '0.00',
        file: null,
        picture_file: null
      }
    }
  },
  methods: {
    ...mapActions(['sendSnackbar']),
    async create() {
      this.loading = true
      const product = Object.assign({}, this.product)
      delete product.picture
      delete product.author
      delete product.latest_version
      product.price = Number(product.price)

      const formData = new FormData()
      Object.keys(product).forEach((key) => {
        formData.append(key, product[key])
      })

      this.sendSnackbar({
        text: 'Creating product, please wait...',
        color: 'warning'
      })
      try {
        const res = await this.$axios.$post('/api/products', formData, {
          headers: {
            'content-type': 'multipart/form-data'
          }
        })
        this.sendSnackbar({
          text: 'Product created successfully',
          color: 'success'
        })
        this.$router.push(`/products/${res._id}`)
      } catch {}
      this.loading = false
    },
    showPicture(file) {
      this.product.picture = URL.createObjectURL(file)
      this.product.picture_file = file
    }
  }
}
</script>
