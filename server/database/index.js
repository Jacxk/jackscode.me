const { connect, connection } = require('mongoose')
const increment = require('mongoose-auto-increment')

const url = 'mongodb+srv://admin:admin@cluster0-ljx07.mongodb.net/plugin-store'

const options = {
  useNewUrlParser: true,
  poolSize: 4,
  useUnifiedTopology: true
}

// increment.initialize(connection)

module.exports = {
  async connectDB() {
    await connect(url, options)
  }
}
