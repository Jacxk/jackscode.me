<template>
  <v-container>
    <v-row>
      <v-col cols="12" xs="12" sm="4" md="4" lg="3" xl="2">
        <v-card outlined width="100%">
          <v-img :src="product.picture" max-height="200px" contain/>
          <v-divider/>
          <v-card-title>
            <span>{{product.name}}</span>
          </v-card-title>
          <v-card-text>
            <div>
              Description: {{product.description}}
            </div>
            <div>
              Author: {{product.author}}
            </div>
            <div>
              Version: {{product.version}}
            </div>
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
        </v-card>
      </v-col>
      <v-col cols="12" xs="12" sm="8" md="8" lg="9" xl="10">
        <v-card outlined width="100%" height="100%">
          <v-card-text>
            <div v-html="$md.render(product.page_content)"/>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-card outlined width="100%" height="100%">
          <v-subheader>Ratings</v-subheader>

          <v-list v-for="i in 5" :key="i">
            <v-divider/>

            <v-list-item>

              <v-list-item-avatar>
                <v-img :src="product.picture"/>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title class="d-flex justify-space-between">
                  <span>Person #{{i}}</span>
                  <v-rating
                    :value="Math.random()*5"
                    color="yellow darken-3"
                    background-color="grey darken-1"
                    empty-icon="$ratingFull"
                    half-increments
                    readonly
                    small
                    dense
                  />
                </v-list-item-title>
                <v-list-item-subtitle>This Item is awesome</v-list-item-subtitle>
              </v-list-item-content>

            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: 'Id',
    async asyncData({params, $axios}) {
      try {
        const product = await $axios.$get(`/api/product/${params.id}`)
        return {product}
      } catch (e) {
        return {error: e.message}
      }
    },
    data() {
      return {
        params: this.$route.params,
        product: {}
      }
    }
  }
</script>

<style scoped></style>
