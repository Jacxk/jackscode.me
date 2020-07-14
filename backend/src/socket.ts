import io from 'socket.io-client'

const client = io.connect(`http://websocket:${process.env.SOCKET_PORT}`, {
  path: '/gateway'
})

client.on('connect', () => {
  console.log(`Connected to socket server as ${client.id}`)
})

export = client
