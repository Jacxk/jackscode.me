export default function({ $axios, store }: any) {
  $axios.onError((error: any) => {
    const data = error.response.data

    blotToJson(data).then(({ error }) => {
      store.dispatch('sendSnackbar', { text: error, color: 'error' })
    })
  })

  function blotToJson(data: Blob | any) {
    return new Promise<{ error: string }>((resolve) => {
      if (data instanceof Blob) {
        const reader = new FileReader()
        reader.addEventListener('loadend', () => {
          if (typeof reader.result === 'string') {
            resolve(JSON.parse(reader.result))
          } else {
            resolve({ error: 'Something bad happened!' })
          }
        })
        reader.readAsText(data)
      } else {
        resolve(data)
      }
    })
  }
}
