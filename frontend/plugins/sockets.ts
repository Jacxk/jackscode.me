import Vue from 'vue'
import VueSocketIO from 'vue-socket.io'

export default ({ store }: any) => {
  Vue.use(
    new VueSocketIO({
      debug: true,
      connection: '/gateway',
      vuex: { actionPrefix: 'socket_', store },
      // @ts-ignore
      options: { path: '/gateway' }
    })
  )
}
