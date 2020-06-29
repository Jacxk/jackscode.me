import { model, Schema } from 'mongoose'

const schema = new Schema({
  customerId: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  token: {
    type: String,
    default: ''
  },
  avatar: {
    type: String,
    default: 'https://via.placeholder.com/200'
  },
  products_bought: [
    {
      type: Schema.Types.ObjectId,
      ref: 'product',
      default: []
    }
  ],
  ratings_given: [
    {
      type: Schema.Types.ObjectId,
      ref: 'rating',
      default: []
    }
  ],
  cart: [
    {
      type: Schema.Types.ObjectId,
      ref: 'product',
      default: []
    }
  ],
  created_at: {
    type: Date,
    default: Date.now
  }
})

export = model('user', schema)
