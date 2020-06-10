const { connect } = require('mongoose')

const [user, password] = [process.env.DB_USER, process.env.DB_PASS]
const url = `mongodb+srv://${user}:${password}@cluster0-ljx07.mongodb.net/plugin-store`

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
