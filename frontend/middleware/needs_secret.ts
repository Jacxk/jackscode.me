export default function({ store, redirect }: any) {
  if (!store.state.checkout_secret) {
    redirect('/cart')
  }
}
