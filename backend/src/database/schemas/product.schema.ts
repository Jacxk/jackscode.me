import { model, Schema } from 'mongoose'

const schema = new Schema({
  name: {
    type: String,
    required: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'user',
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
  price: {
    type: Number,
    min: 100,
    max: 5000,
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

export = model('product', schema)
