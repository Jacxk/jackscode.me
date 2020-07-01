// @ts-ignore
export default function({ store, redirect }) {
  if (!store.state.checkout_secret) {
    redirect('/cart')
  }
}
