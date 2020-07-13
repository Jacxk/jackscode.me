import { model, Schema } from 'mongoose'

const schema = new Schema({
  version: {
    type: Schema.Types.ObjectId,
    ref: 'version',
    required: true
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: 'product',
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
})

export = model('notification', schema)
