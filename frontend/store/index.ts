import axios from 'axios'

export const state = () => ({
  cart: [],
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
  }
}
export const actions = {
  sendSnackbar({ commit }: any, snackbar: Snackbar) {
    commit('HIDE_SNACKBAR', null)
    setTimeout(() => {
      commit('SEND_SNACKBAR', snackbar)
    }, 200)
  },
  addToCart({ state, commit, dispatch }: any, item: Item) {
    const { auth } = state
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
  setCart({ commit }: any, cart: Array<any>) {
    commit('SET_CART', cart)
  },
  logout() {
    // TODO: Clear cart
  }
}

export const getters = {
  hasItem: (state: any) => (item: Item) => {
    return state.cart.some((it: Item) => it._id === item._id)
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
