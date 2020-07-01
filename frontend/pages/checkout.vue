<template>
  <v-row>
    <v-col>
      <v-card>
        <v-card-text>
          <div>
            <v-subheader class="text-uppercase px-0 mx-0">
              User Information
            </v-subheader>
            <v-form>
              <v-text-field
                v-model="email"
                label="Email"
                hint="Where the receipt is going!"
                solo
                outlined
                dense
                disabled
              />
            </v-form>
          </div>
          <div>
            <v-subheader class="text-uppercase px-0 mx-0">
              Payment Information
            </v-subheader>
            <form id="payment-form" action="/charge" method="post">
              <div class="form-row">
                <div id="card-element" />
                <!-- Used to display form errors. -->
                <div id="card-errors" role="alert" class="red--text" />
              </div>
              <v-btn
                type="submit"
                text
                block
                outlined
                color="primary"
                class="mt-5"
                :disabled="loading"
                :loading="loading"
              >
                Pay ${{ totalPrice }}
              </v-btn>
            </form>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col>
      <v-card min-height="50vh">
        <v-card-title>Products</v-card-title>
        <v-divider />
        <div v-if="hasProducts()">
          <Item
            v-for="(product, i) in cartProducts"
            :key="i"
            :product="product"
            dense
            deleteable
            @remove="updateCheckout(totalPrice - $event.price)"
          />
        </div>
        <v-card-text v-else>
          <v-subheader>
            No items in cart... You shouldn't even see this...
          </v-subheader>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { mapActions } from 'vuex'
import Item from '../components/products/item'

export default {
  middleware: ['auth', 'needs_secret'],
  name: 'Checkout',
  components: { Item },
  data() {
    const user = this.$auth.user
    return {
      username: user.username,
      email: user.email,
      loading: false,
      clientSecret: this.$store.state.checkout_secret
    }
  },
  computed: {
    user() {
      return this.$auth.user
    },
    cartProducts() {
      return this.$store.state.cart
    },
    totalPrice() {
      return this.cartProducts.reduce((a, b) => a + b.price, 0)
    }
  },
  mounted() {
    // eslint-disable-next-line no-undef
    const stripe = Stripe(
      'pk_test_51Gpz2YEr0fztYOZo5Ki6cfu0SNuiZYEavsFz7wkFmZiG4HV4LD3QVT6cO1QlUJ9Yk9xHwrpHSO2ippIGyeniwmzs00iCgB3lM9'
    )
    const elements = stripe.elements()
    const card = elements.create('card', {
      style: {
        base: {
          color: '#ffffff',
          fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
          fontSmoothing: 'antialiased',
          fontSize: '16px',
          '::placeholder': {
            color: '#aab7c4'
          }
        },
        invalid: {
          color: '#fa755a',
          iconColor: '#fa755a'
        }
      }
    })
    card.mount('#card-element')
    card.on('change', function(event) {
      const displayError = document.getElementById('card-errors')
      if (event.error) {
        displayError.textContent = event.error.message
      } else {
        displayError.textContent = ''
      }
    })

    // Handle form submission.
    const form = document.getElementById('payment-form')
    form.addEventListener('submit', (event) => {
      event.preventDefault()
      this.loading = true

      stripe
        .confirmCardPayment(this.clientSecret, {
          payment_method: {
            card
          },
          receipt_email: this.user.email
        })
        .then(({ error, paymentIntent }) => {
          if (error) {
            // Inform the user if there was an error.
            const errorElement = document.getElementById('card-errors')
            errorElement.textContent = error.message
            this.loading = false
          } else if (paymentIntent.status === 'succeeded') {
            this.loading = false
            this.sendSnackbar({ text: 'Successfully Paid', color: 'success' })

            this.$axios.put(
              `/api/users/${this.user._id}/product`,
              paymentIntent
            )

            this.finishCheckout()
            this.$auth.fetchUser()
            this.$router.push('/')
          }
        })
        .catch((error) => {
          this.loading = false
          this.sendSnackbar({ text: error.message, color: 'error' })
        })
    })
  },
  methods: {
    ...mapActions([
      'sendSnackbar',
      'setCart',
      'finishCheckout',
      'updateCheckout'
    ]),
    hasProducts() {
      return this.cartProducts.length > 0
    },
    checkout() {
      const form = document.getElementById('payment-form')
      form.submit()
    }
  }
}
</script>

<style lang="scss">
/**
 * The CSS shown here will not be introduced in the Quickstart guide, but shows
 * how you can use CSS to style your Element's container.
 */
.StripeElement {
  box-sizing: border-box;

  height: 40px;

  padding: 10px 12px;

  border: 1px solid grey;
  border-radius: 4px;
  background-color: transparent;

  -webkit-transition: border 150ms ease;
  transition: border 150ms ease;
}

.StripeElement--focus {
  border: 1px solid white;
}

.StripeElement--invalid {
  border-color: #fa755a;
}
</style>
