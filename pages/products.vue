<template>
  <v-container>
    <h1 class="text-center">Product List</h1>
    <v-row align="stretch" justify="center" dense>
      <v-col
        v-for="product in products"
        :key="product.name"
        xs="12"
        sm="6"
        md="4"
        lg="3"
        xl="2"
      >
        <v-card
          :to="'/product/' + product.id"
          :ripple="false"
          height="100%"
          style="position: relative"
          outlined
        >
          <v-img
            :src="product.img"
            height="200px"
            class="align-end"
            gradient="to bottom, rgba(0,0,0,0),rgba(0,0,0,.2), rgba(0,0,0,.8)"
          >
            <v-card-title>{{ product.name }}</v-card-title>
          </v-img>

          <v-card-text class="mb-10">
            <p>{{ product.description }}</p>
          </v-card-text>

          <v-card-actions
            style="position: absolute; bottom: 0; right: 0; left: 0"
          >
            <v-rating
              v-model="product.rating"
              :title="product.rating"
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
</template>

<script>
export default {
  data() {
    return {
      products: [
        {
          id: 0,
          name: 'Product 1',
          description: 'This product cures cancer',
          rating: 1.1,
          img: 'https://via.placeholder.com/500'
        },
        {
          id: 1,
          name: 'Product 2',
          description:
            'This product does not cure cancer but you should buy it',
          rating: 4.5,
          img: 'https://via.placeholder.com/500'
        },
        {
          id: 2,
          name: 'Product 3',
          description:
            'This product does not cure cancer but you should buy it',
          rating: 5,
          img: 'https://via.placeholder.com/500'
        },
        {
          id: 3,
          name: 'Product 4',
          description:
            'This product does not cure cancer but you should buy it ' +
            'This product does not cure cancer but you should buy it',
          rating: 3.5,
          img: 'https://via.placeholder.com/500'
        }
      ]
    }
  }
}
</script>
