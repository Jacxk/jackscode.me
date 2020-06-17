import { model, Schema } from 'mongoose'

const schema = new Schema({
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
