<template>
  <v-bottom-navigation grow fixed app>
    <v-btn v-for="(item, i) in items" :key="i" :to="item.href">
      <span>{{ item.title }}</span>
      <v-icon>mdi-{{ item.icon }}</v-icon>
    </v-btn>
    <v-btn to="/cart">
      <span>Cart</span>
      <v-badge :content="inCart" top overlap>
        <v-icon>mdi-cart</v-icon>
      </v-badge>
    </v-btn>
  </v-bottom-navigation>
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
    inCart() {
      return String(this.$store.state.cart.length)
    }
  }
}
</script>
