const firebaseConfig = {
  apiKey: 'AIzaSyD73aM65GIQd6-dDOTWNL7_bQTJQZ7Xn7k',
  authDomain: 'jackscodedotme.firebaseapp.com',
  databaseURL: 'https://jackscodedotme.firebaseio.com',
  projectId: 'jackscodedotme',
  storageBucket: 'jackscodedotme.appspot.com',
  messagingSenderId: '730475699521',
  appId: '1:730475699521:web:f304d722488737312f55c0',
  measurementId: 'G-RQSXJKREY5'
}

// eslint-disable-next-line no-undef
firebase.initializeApp(firebaseConfig)
// eslint-disable-next-line no-undef
firebase.analytics()

// eslint-disable-next-line no-undef
const remoteConfig = firebase.remoteConfig()
remoteConfig.settings = {
  minimumFetchIntervalMillis: 3600000
}
remoteConfig.defaultConfig = {
  hot_items: []
}
