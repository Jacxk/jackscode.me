import { model, Schema } from 'mongoose'

const schema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'product',
    required: true
  },
  version: {
    type: Schema.Types.ObjectId,
    ref: 'version',
    required: true
  },
  created_by: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  content: {
    type: String,
    max: 500,
    required: true
  },
  stars: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
})

export = model('rating', schema)
