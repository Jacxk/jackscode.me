import Vue from 'vue'
import VueSocketIO from 'vue-socket.io'

export default ({ store }: any) => {
  Vue.use(
    new VueSocketIO({
      debug: true,
      connection: 'localhost:2020',
      vuex: { actionPrefix: 'socket_', store },
      // @ts-ignore
      options: { path: '/socket' }
    })
  )
}
