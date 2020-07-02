import VuexPersistence from 'vuex-persist'

// @ts-ignore
export default ({ store }) => {
  new VuexPersistence({
    storage: window.localStorage,
    reducer: (state: any) => ({
      cart: state.cart,
      checkout_secret: state.checkout_secret,
      preferences: state.preferences
    })
  }).plugin(store)
}
