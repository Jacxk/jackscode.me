const colors = require('vuetify/es5/util/colors').default

module.exports = {
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: '%s - ' + process.env.npm_package_name,
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    script: [{ src: 'https://js.stripe.com/v3/' }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#2196F3' },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    { src: '~/plugins/vuex-persist', ssr: false },
    { src: '~/plugins/timeago', ssr: false },
    { src: '~/plugins/progressive-image', ssr: false },
    { src: '~/plugins/sockets', ssr: false },
    { src: '~/plugins/axios' }
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    '@nuxt/typescript-build',
    // Doc: https://github.com/nuxt-community/stylelint-module
    '@nuxtjs/vuetify'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    '@nuxtjs/markdownit',
    '@nuxtjs/auth',
    '@nuxtjs/firebase'
  ],
  auth: {
    strategies: {
      local: {
        endpoints: {
          login: {
            url: '/api/auth/login',
            method: 'post',
            propertyName: 'token'
          },
          logout: { url: '/api/auth/logout', method: 'post' },
          user: { url: '/api/auth/user', method: 'get', propertyName: false }
        }
      }
    },
    redirect: {
      login: '/auth/login',
      logout: '/',
      callback: '/auth/login',
      home: '/'
    }
  },
  firebase: {
    config: {
      apiKey: 'AIzaSyD73aM65GIQd6-dDOTWNL7_bQTJQZ7Xn7k',
      authDomain: 'jackscodedotme.firebaseapp.com',
      databaseURL: 'https://jackscodedotme.firebaseio.com',
      projectId: 'jackscodedotme',
      storageBucket: 'jackscodedotme.appspot.com',
      messagingSenderId: '730475699521',
      appId: '1:730475699521:web:f304d722488737312f55c0',
      measurementId: 'G-RQSXJKREY5'
    },
    onFirebaseHosting: false,
    analytics: true,
    services: {
      remoteConfig: {
        settings: {
          fetchTimeoutMillis: 60000,
          minimumFetchIntervalMillis: 43200000
        },
        defaultConfig: {
          hot_items: []
        }
      }
    }
  },
  /*
   ** markdownit options
   ** See https://github.com/markdown-it/markdown-it
   */
  markdownit: {
    injected: true,
    preset: 'default',
    html: false,
    linkify: true,
    breaks: true
  },
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    baseURL: 'http://nginx:80/',
    browserBaseURL: '/',
    proxy: false
  },
  proxy: {
    '/api/': `http://backend:${process.env.SERVER_PORT}`,
    '/gateway/': {
      target: `http://websocket:${process.env.SOCKET_PORT}/`,
      ws: true
    }
  },
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: true,
      light: false,
      themes: {
        dark: {
          theme_1: '#0c0c0c',
          theme_2: '#171717',
          theme_3: '#1f1f1f',
          theme_4: '#242424',
          theme_5: '#323232',
          theme_text: colors.white,
          primary: colors.blue.base,
          accent: colors.red.darken4,
          secondary: colors.amber.darken3,
          info: colors.teal.base,
          warning: colors.yellow.base,
          error: colors.red.base,
          success: colors.green.base
        },
        light: {
          theme_1: '#ffffff',
          theme_2: '#f6f6f6',
          theme_3: '#ececec',
          theme_4: '#dcdcdc',
          theme_5: '#d0d0d0',
          theme_text: colors.black,
          primary: colors.blue.base,
          accent: colors.grey,
          secondary: colors.amber,
          info: colors.teal.darken4,
          warning: colors.yellow.darken4,
          error: colors.red.darken4,
          success: colors.green.darken4
        }
      }
    }
  },
  watchers: {
    webpack: {
      poll: true
    }
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    extend(config, ctx) {}
  },
  generate: {
    fallback: true
  }
}
