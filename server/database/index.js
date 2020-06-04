const { connect } = require('mongoose')

const url = 'mongodb+srv://admin:admin@cluster0-ljx07.mongodb.net/plugin-store'

const options = {
  useNewUrlParser: true,
  poolSize: 4,
  useUnifiedTopology: true
}

module.exports = {
  async connectDB() {
    await connect(url, options)
  }
}
