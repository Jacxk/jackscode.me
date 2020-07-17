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

    if (item.price < 1) {
      return dispatch('sendSnackbar', {
        text: 'Cannot add free item',
        color: 'error'
      })
    }

    if (getters.bought(item._id)) {
      return dispatch('sendSnackbar', {
        text: 'Cannot add item you own',
        color: 'error'
      })
    }

    if (auth.loggedIn) {
      // @ts-ignore
      this.$axios
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
        .catch(() => {})
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
      // @ts-ignore
      this.$axios
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
        .catch(() => {})
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
  logout({ commit }: any) {
    commit('CLEAR_STATE')
  },
  setClientSecret({ commit }: any, token: string) {
    commit('SET_CLIENT_SECRET', token)
  },
  async handleCheckout({ state, dispatch }: any, price: number) {
    if (!state.checkout_secret) {
      await dispatch('setCheckout', price)
    } else {
      await dispatch('updateCheckout', price)
    }
  },
  async setCheckout({ dispatch, state }: any, price: number) {
    const { auth, cart } = state

    // @ts-ignore
    const { data } = await this.$axios.post('/api/payments/create', {
      amount: price,
      products: cart.map((product: any) => product._id),
      receipt_email: auth.user.email
    })

    dispatch('setClientSecret', data.client_secret)
  },
  // TODO: Fix removing product on checkout not using updated values
  async updateCheckout({ state }: any, price: number) {
    // eslint-disable-next-line camelcase
    const { checkout_secret, auth, cart } = state
    // @ts-ignore
    await this.$axios.post('/api/payments/update', {
      secret: checkout_secret.split('_secret_')[0],
      amount: price,
      products: cart.map((product: any) => product._id),
      receipt_email: auth.user.email
    })
  },
  finishCheckout({ commit }: any) {
    commit('CLEAR_STATE')
  }
}

export const getters = {
  hasItem({ cart }: any) {
    return (item: Item) => {
      if (!item) return false
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
  price() {
    return (price: number) => {
      if (price > 0) {
        return `$${price}`
      }
      return 'Free'
    }
  },
  hasRole({ auth }: any) {
    return (role: number) => {
      const user = auth.user
      if (!user) return false
      return user.role === role
    }
  },
  sortDescending() {
    return (array: Array<any>) => {
      if (!array) return array
      const newArray = [...array].map((value) => ({
        ...value,
        created_at: new Date(value.created_at).getTime()
      }))
      return newArray.sort((a, b) => b.created_at - a.created_at)
    }
  }
}

interface Item {
  _id: number
  price: number
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
