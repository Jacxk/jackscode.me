<template>
  <div>
    <v-bottom-navigation grow fixed app>
      <v-btn v-for="(item, i) in items" :key="i" :to="item.href">
        <span>{{ item.title }}</span>
        <v-icon>mdi-{{ item.icon }}</v-icon>
      </v-btn>
      <v-btn to="/cart">
        <span>Cart</span>
        <v-badge v-if="hasItemsInCart" :content="inCart" top overlap>
          <v-icon>mdi-cart</v-icon>
        </v-badge>
        <v-icon v-else>mdi-cart</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </div>
</template>

<script>
export default {
  name: 'BottomNav',
  data() {
    return {
      items: [
        { title: 'Home', icon: 'home', href: '/' },
        { title: 'Products', icon: 'shopping', href: '/products' },
        { title: 'Account', icon: 'account', href: '/users/@me' }
      ]
    }
  },
  computed: {
    cart() {
      return this.$store.state.cart
    },
    inCart() {
      return String(this.cart.length)
    },
    hasItemsInCart() {
      return this.cart.length > 0
    }
  }
}
</script>
<style>
.v-bottom-navigation--fixed {
  position: fixed !important;
}

.v-item-group.v-bottom-navigation .v-btn {
  height: inherit !important;
}
</style>
