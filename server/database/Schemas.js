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
  page_content: {
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
  },
  created_at: {
    type: Date,
    default: Date.now
  }
})

const user = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    salt: {
      type: String,
      required: true
    },
    hash: {
      type: String,
      required: true
    }
  },
  tokens: {
    access: String,
    refresh: String
  },
  cart: [
    {
      type: Schema.Types.ObjectID,
      ref: 'product',
      default: []
    }
  ],
  created_at: {
    type: Date,
    default: Date.now
  }
})

module.exports = {
  Product: model('product', product),
  User: model('user', user)
}
