export const state = () => ({
  cart: [],
  hot: ['5ed846178e9303175c83fb12', '5ed846c18e9303175c83fb13'],
  snackbar: {
    showing: false,
    timeout: 6000,
    color: '',
    text: ''
  }
})

export const mutations = {
  add(state: any, item: Item) {
    state.cart.push(item)
  },
  remove(state: any, item: Item) {
    state.cart = state.cart.filter((it: Item) => it._id !== item._id)
  },
  toggle(state: any, item: Item) {
    if (getters.hasItem(state)(item)) {
      mutations.remove(state, item)
    } else {
      mutations.add(state, item)
    }
  },
  sendSnackbar(state: any, snackbar: any) {
    state.snackbar = { ...snackbar, showing: true }
  },
  hideSnackbar(state: any) {
    state.snackbar.showing = false
  }
}
export const actions = {
  sendSnackbar({ commit }: any, snackbar: any) {
    commit('hideSnackbar')
    setTimeout(() => {
      commit('sendSnackbar', snackbar)
    }, 200)
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
  likes: number
  picture: string | 'https://via.placeholder.com/500'
}
