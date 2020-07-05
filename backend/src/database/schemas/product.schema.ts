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
    min: 0,
    max: 50,
    required: true
  },
  rating: {
    type: Number,
    default: 0
  },
  download_url: {
    type: String,
    required: true
  },
  old_versions: [{
    version: String,
    download_path: String,
    default: []
  }],
  created_at: {
    type: Date,
    default: Date.now
  }
})

export = model('product', schema)
