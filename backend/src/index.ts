import { connectDB } from './database'

(() => {
  return new Promise<unknown>((resolve, reject) => {
    connectDB()
      .then(() => {
        import('./app')
          .then(() => resolve())
          .catch(reject)
      })
      .catch(reject)
  })
})()
  .then(() => console.log('Server started!'))
  .catch(console.error)
