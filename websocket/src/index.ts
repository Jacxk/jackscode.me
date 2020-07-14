const io = require('socket.io')

const server = io.listen(process.env.SOCKET_PORT, {
  path: '/gateway'
})

server.on('connection', (socket) => {
  console.log(`New client connection: ${ socket.id }`)

  socket.on('PRODUCT_UPDATE', args => {
    if (args.secret === process.env.SOCKET_SECRET) {
      server.emit('productUpdate', args.data)
    }
  })

})
