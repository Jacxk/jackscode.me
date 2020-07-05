import { connectDB } from './database'
import * as Firebase from 'firebase-admin'
import * as FirebaseConfig from './firebase.config.json'

(() => {
  return new Promise<unknown>((resolve, reject) => {
    connectDB()
      .then(() => {
        Firebase.initializeApp({
          // @ts-ignore
          credential: Firebase.credential.cert(FirebaseConfig),
          storageBucket: 'jackscodedotme.appspot.com'
        })
        import('./app')
          .then(() => resolve())
          .catch(reject)
      })
      .catch(reject)
  })
})()
  .then(() => console.log('Server started!'))
  .catch(console.error)
