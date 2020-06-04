export const state = () => ({
  cart: []
})

export const mutations = {
  add(state: any, item: Item) {
    state.cart.push(item)
  },
  remove(state: any, item: Item) {
    state.cart = state.cart.filter((it: Item) => it._id !== item._id)
  },
  toggle(state: any, item: Item) {
    if (mutations.hasItem(state, item)) {
      mutations.remove(state, item);
    } else {
      mutations.add(state, item);
    }
  },
  hasItem(state: any, item: Item) {
    return state.cart.some((it: Item) => it._id === item._id);
  }
}

interface Item {
  _id: number
  name: string
  description: string
  likes: number
  picture: string | 'https://via.placeholder.com/500'
}
