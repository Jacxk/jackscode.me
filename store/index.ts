export const state = () => ({
  cart: []
})

export const mutations = {
  add(state: any, item: Item) {
    state.cart.push(item)
  },
  remove(state: any, item: Item) {
    state.cart = state.cart.filter((it: Item) => it.id !== item.id)
  },
  toggle(state: any, item: Item) {
    if (mutations.hasItem(state, item)) {
      mutations.remove(state, item);
    } else {
      mutations.add(state, item);
    }
  },
  hasItem(state: any, item: Item) {
    return state.cart.some((it: Item)=> it.id === item.id);
  }
}

interface Item {
  id: number
  name: string
  description: string
  likes: number
  img: string | 'https://via.placeholder.com/500'
}
