const increment = require('mongoose-auto-increment')
const { model, Schema } = require('mongoose')

const product = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  picture: {
    type: String,
    required: true
  },
  version: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    default: 0
  }
})

// schema.plugin(increment.plugin, name);

module.exports = {
  Product: model('product', product)
}
