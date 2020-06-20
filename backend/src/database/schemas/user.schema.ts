import { model, Schema } from 'mongoose'

const schema = new Schema({
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
