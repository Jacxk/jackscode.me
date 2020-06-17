<template>
  <v-container>
    <v-form v-model="valid" autocomplete="off" @submit.prevent="create">
      <v-container>
        <v-row>
          <v-col xs="12" sm="7" md="8" lg="8" xl="8">
            <v-text-field
              ref="name"
              v-model="product.name"
              :counter="20"
              label="Product Name"
              solo
              required
            />

            <v-text-field
              ref="image"
              v-model="product.picture"
              label="Product Image"
              solo
              required
            />

            <v-text-field
              ref="version"
              v-model="product.version"
              label="Product Version"
              solo
              required
            />

            <v-textarea
              ref="description"
              v-model="product.description"
              :counter="300"
              label="Product Description"
              solo
              required
            />
          </v-col>
          <v-col xs="12" sm="5" md="4" lg="4" xl="4">
            <v-toolbar-title>Preview</v-toolbar-title>
            <v-card :ripple="false" class="product-card" outlined>
              <v-img
                :src="product.picture || 'https://via.placeholder.com/500'"
                height="200px"
                class="align-end"
                gradient="to bottom, rgba(0,0,0,0),rgba(0,0,0,.2), rgba(0,0,0,.8)"
              >
                <v-card-title>{{ products.name || 'No Title...' }}</v-card-title>
              </v-img>

              <v-card-text class="mb-10">
                <p>{{ products.description || 'No description...' }}</p>
              </v-card-text>

              <v-card-actions class="product-card-action">
                <v-rating
                  color="yellow darken-3"
                  background-color="grey darken-1"
                  readonly
                  half-increments
                  hover
                  dense
                  small
                  @click.prevent=""
                />

                <v-spacer />

                <v-btn icon @click.prevent="">
                  <v-icon>mdi-cart-plus</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <v-btn
        class="add-product"
        elevation="5"
        type="submit"
        fab
        large
        dark
        bottom
        left
      >
        <v-icon>mdi-content-save</v-icon>
      </v-btn>
    </v-form>
  </v-container>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Create',
  data() {
    return {
      valid: false,
      product: {
        name: '',
        version: '',
        description: '',
        picture: ''
      }
    }
  },
  methods: {
    async create() {
      const get = (key) => (refs[key] || {}).value
      const refs = this.$refs
      const body = {
        name: get('name'),
        description: get('description'),
        version: get('version'),
        picture: get('image')
      }

      try {
        const { data } = await axios.post('/api/products', body)
        console.log(data)
      } catch {
        console.log('Internal error')
      }
    }
  }
}
</script>
