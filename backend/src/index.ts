import { connectDB, Schemas } from './database'
import * as Firebase from 'firebase-admin'
import * as FirebaseConfig from './firebase.config.json'

(() => {
  return new Promise<unknown>((resolve, reject) => {
    connectDB()
      .then(async () => {
        try {
          Firebase.initializeApp({
            // @ts-ignore
            credential: Firebase.credential.cert(FirebaseConfig),
            storageBucket: 'jackscodedotme.appspot.com'
          })
          await import('./app')
          await import('./socket')
          resolve()
        } catch (e) {
          reject(e)
        }
      })
      .catch(reject)
  })
})()
  .then(() => console.log('Server started!'))
  .catch(console.error)
