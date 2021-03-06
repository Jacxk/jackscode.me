export const namespaced = true

export const actions = {
  socket_productUpdate({ dispatch, rootState }: any, data: any) {
    const auth = rootState.auth
    const products = auth.user.products_bought
    if (
      auth.loggedIn &&
      products.some((product: any) => product._id === data._id)
    ) {
      dispatch(
        'sendSnackbar',
        { text: `${data.name} has been updated`, color: 'info' },
        { root: true }
      )
    }
  }
}
