<template>
  <v-container>
    <v-list>
      <v-subheader class="center-text">Your Cart</v-subheader>
      <template v-for="item in products">

        <v-divider></v-divider>

        <v-list-item :to="'/product/'+item.id" :ripple="false">
          <v-list-item-avatar>
            <v-img :src="item.img"/>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title v-text="item.name"/>
            <v-list-item-subtitle v-text="item.description"/>
          </v-list-item-content>

          <v-list-item-action v-text="item.amount || 1"/>
        </v-list-item>

      </template>
    </v-list>
  </v-container>
</template>

<script>
  export default {
    name: "cart",
    data() {
      return {
        products: [
          {
            id: 0,
            name: 'Product 1',
            description: 'This product cures cancer',
            likes: 15,
            img: 'https://via.placeholder.com/500',
            amount: 2
          },
          {
            id: 1,
            name: 'Product 2',
            description: 'This product does not cure cancer but you should buy it',
            likes: 69,
            img: 'https://via.placeholder.com/500',
            amount: 5
          },
          {
            id: 3,
            name: 'Product 4',
            description: 'This product does not cure cancer but you should buy it ' +
              'This product does not cure cancer but you should buy it',
            likes: 69,
            img: 'https://via.placeholder.com/500'
          },
        ]
      }
    }
  }
</script>

<style scoped>

</style>
