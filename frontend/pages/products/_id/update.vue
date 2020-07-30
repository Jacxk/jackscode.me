<template>
  <v-form v-model="valid" autocomplete="off" @submit.prevent="create">
    <v-container>
      <v-row>
        <v-col class="mx-auto" xs="12" sm="7" md="8" lg="8" xl="8">
          <v-card color="theme_2">
            <v-card-text>
              <v-text-field
                v-model="product.title"
                label="Title"
                hint="Give a title to this version"
                outlined
                required
              />

              <v-text-field
                v-model="product.version"
                label="Version"
                hint="Current version: 1.5"
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

              <v-tabs background-color="theme_3" grow>
                <v-tab>Edit</v-tab>
                <v-tab>Preview</v-tab>

                <v-tab-item class="theme_2">
                  <v-textarea
                    v-model="product.change_log"
                    background-color="theme_2"
                    label="Change Log"
                    hint="Describe what changed here!"
                    auto-grow
                    outlined
                    required
                  />
                </v-tab-item>
                <v-tab-item>
                  <v-card color="theme_2" flat outlined>
                    <v-card-text
                      v-html="$md.render(product.change_log || 'No content...')"
                    />
                  </v-card>
                </v-tab-item>
              </v-tabs>
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
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'Create',
  middleware: ['auth', 'seller'],
  data() {
    return {
      loading: false,
      valid: false,
      product: {
        version: '',
        change_log: '',
        file: null,
        product: this.$route.params.id
      }
    }
  },
  methods: {
    ...mapActions(['sendSnackbar']),
    async create() {
      this.loading = true
      const product = Object.assign({}, this.product)

      const formData = new FormData()
      Object.keys(product).forEach((key) => {
        formData.append(key, product[key])
      })

      this.sendSnackbar({
        text: 'Updating product, please wait...',
        color: 'warning'
      })

      try {
        const id = this.$route.params.id
        await this.$axios.$post(`/api/products/${id}/update`, formData, {
          headers: {
            'content-type': 'multipart/form-data'
          }
        })
        this.sendSnackbar({
          text: 'Product updated successfully',
          color: 'success'
        })
        this.$router.push(`/products/${id}`)
      } catch {}
      this.loading = false
    }
  }
}
</script>
<style lang="scss">
.v-tabs-items {
  padding-top: 10px;
}
</style>
