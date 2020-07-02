export const namespaced = true

export const state = () => ({
  view: {
    products: 0
  }
})

export const mutations = {
  SET_PRODUCT_VIEW(state: any, view: number) {
    state.view.products = view
  }
}

export const actions = {
  changeProductView({ commit }: any, view: number) {
    commit('SET_PRODUCT_VIEW', view)
  }
}

export const getters = {
  getProductView({ view }: any) {
    return () => view.products
  }
}
