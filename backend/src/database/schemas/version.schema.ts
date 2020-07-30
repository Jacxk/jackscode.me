import { model, Schema } from 'mongoose'

const schema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'product',
    required: true
  },
  version: {
    type: String,
    required: true
  },
  download_url: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  downloads: {
    type: Number,
    default: 0
  },
  change_log: {
    type: String,
    default: ''
  },
  mc_versions: [{
    type: String,
    default: []
  }],
  created_at: {
    type: Date,
    default: Date.now
  }
})

export = model('version', schema)
