import axios from 'axios'

export const state = () => ({
  cart: [],
  checkout_secret: '',
  snackbar: {
    showing: false,
    timeout: 6000,
    color: '',
    text: ''
  }
})

export const mutations = {
  ADD_TO_CART({ cart, auth }: any, item: Item) {
    cart.push(item)
    if (auth.loggedIn) {
      auth.user.cart.push(item)
    }
  },
  REMOVE_FROM_CART(state: any, item: Item) {
    state.cart = state.cart.filter((it: Item) => it._id !== item._id)

    if (state.auth.loggedIn) {
      state.auth.user.cart = state.cart
    }
  },
  SEND_SNACKBAR(state: any, snackbar: Snackbar) {
    state.snackbar = { ...snackbar, showing: true }
  },
  HIDE_SNACKBAR(state: any) {
    state.snackbar.showing = false
  },
  SET_CART(state: any, newCart: Array<any>) {
    state.cart = newCart
    if (state.auth.loggedIn) {
      state.auth.cart = newCart
    }
  },
  SET_CLIENT_SECRET(state: any, token: string) {
    state.checkout_secret = token
  },
  CLEAR_STATE(state: any) {
    state.checkout_secret = ''
    state.cart = []
  }
}
export const actions = {
  sendSnackbar({ commit }: any, snackbar: Snackbar) {
    commit('HIDE_SNACKBAR', null)
    setTimeout(() => {
      commit('SEND_SNACKBAR', snackbar)
    }, 200)
  },
  addToCart({ state, commit, dispatch, getters }: any, item: Item) {
    const { auth } = state

    if (getters.bought(item._id)) {
      return dispatch('sendSnackbar', {
        text: 'Cannot add item you own',
        color: 'error'
      })
    }

    if (auth.loggedIn) {
      axios
        .put(`/api/users/${auth.user._id}/cart`, {
          product: item._id
        })
        .then(() => {
          commit('ADD_TO_CART', item)
          dispatch('sendSnackbar', {
            text: 'Item added to cart',
            color: 'success'
          })
        })
        .catch((e) => {
          dispatch('sendSnackbar', {
            text: e.response.data.error,
            color: 'error'
          })
        })
    } else {
      commit('ADD_TO_CART', item)
      dispatch('sendSnackbar', {
        text: 'Item added to cart',
        color: 'success'
      })
    }
  },
  removeFromCart({ state, commit, dispatch }: any, item: Item) {
    const { auth } = state
    if (auth.loggedIn) {
      axios
        .delete(`/api/users/${auth.user._id}/cart`, {
          data: {
            product: item._id
          }
        })
        .then(() => {
          commit('REMOVE_FROM_CART', item)
          dispatch('sendSnackbar', {
            text: 'Item removed from cart',
            color: 'success'
          })
        })
        .catch((e) => {
          dispatch('sendSnackbar', {
            text: e.response.data.error,
            color: 'error'
          })
        })
    } else {
      commit('REMOVE_FROM_CART', item)
      dispatch('sendSnackbar', {
        text: 'Item removed from cart',
        color: 'success'
      })
    }
  },
  setCart({ commit, getters }: any, cart: Array<any>) {
    cart = cart.filter((product) => !getters.bought(product._id))
    commit('SET_CART', cart)
  },
  logout() {
    // TODO: Clear cart
  },
  setClientSecret({ commit }: any, token: string) {
    commit('SET_CLIENT_SECRET', token)
  },
  async handleCheckout({ state, dispatch }: any, price: number) {
    // eslint-disable-next-line camelcase
    const { checkout_secret, cart, auth } = state

    // eslint-disable-next-line camelcase
    if (!checkout_secret) {
      const { data } = await axios.post(
        '/api/payments/secret',
        {
          amount: price,
          products: cart.map((product: any) => product._id),
          receipt_email: auth.user.email
        },
        {
          headers: {
            Authorization: window.localStorage.getItem('auth._token.local')
          }
        }
      )

      dispatch('setClientSecret', data.client_secret)
    }
  },
  finishCheckout({ commit }: any) {
    commit('CLEAR_STATE')
  }
}

export const getters = {
  hasItem({ cart }: any) {
    return (item: Item) => {
      return cart.some((it: Item) => it._id === item._id)
    }
  },
  bought({ auth }: any) {
    return (product: string) => {
      if (!auth.loggedIn) return false

      // eslint-disable-next-line camelcase
      const { products_bought } = auth.user
      // eslint-disable-next-line camelcase
      if (!products_bought) return false

      // eslint-disable-next-line camelcase
      return !!products_bought.find((p: any) => p._id === product)
    }
  },
  // eslint-disable-next-line camelcase
  isBuying({ checkout_secret }: any) {
    // eslint-disable-next-line camelcase
    return !!checkout_secret
  }
}

interface Item {
  _id: number
  name: string
  description: string
  rating: number
  picture: string | 'https://via.placeholder.com/500'
}

interface Snackbar {
  text: string
  showing?: boolean | true
  color?: string | 'success'
  timeout?: number | 6000
}
