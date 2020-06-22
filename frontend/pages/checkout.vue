<template>
  <v-main>
    <v-btn @click.prevent.stop="checkout">Checkout</v-btn>
  </v-main>
</template>

<script>
export default {
  name: 'Checkout',
  methods: {
    async checkout() {
      try {
        const data = await this.$axios.$get('/api/payments/secret')
        console.log(data)
      } catch {}
    }
  }
}
</script>
