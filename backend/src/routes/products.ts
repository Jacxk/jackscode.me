import { Router } from 'express'
import { Schemas } from '../database'
import { hasFiles, newProduct } from '../validation'
import { JWT, sendError, uploadFirebase } from '../helpers'

import Multer from 'multer'

const products = Router()
const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 16 * (1024 * 1024)
  }
})

const upload = multer.fields([
  {
    name: 'picture_file',
    maxCount: 1
  },
  {
    name: 'file',
    maxCount: 1
  }
])

products.get('/', async function(req, res) {
  try {
    const query = req.query
    let conditions = {}

    if (query && query.search) {
      // @ts-ignore
      conditions = { name: new RegExp(query.search, 'ig') }
    }

    const products = await Schemas.Product
      .find(conditions)
      .populate('author', 'username')
      .lean()
      .exec()
    res.json(products)
  } catch (e) {
    console.error(e)
    return sendError(res)
  }
})

products.get('/:id', async function(req, res) {
  try {
    const product = await Schemas.Product
      .findById(req.params.id)
      .populate('author', 'username')
      .lean()
      .exec()
    res.json(product)
  } catch (e) {
    console.error(e)
    return sendError(res)
  }
})

products.post('/', JWT.authenticate, upload, async function(req, res) {
  try {
    const body = req.body

    if (!hasFiles(res, body.picture_file, body.file)) return

    const { error } = newProduct(body)
    if (error) {
      return sendError(res, error.message, 400)
    }

    const { role, _id }: any = req.user

    if (role !== 'seller') {
      return sendError(res, 'Forbidden', 403)
    }

    // @ts-ignore
    const pics = req.files.picture_file
    // @ts-ignore
    const files = req.files.file

    if (!hasFiles(res, !pics, !files)) return

    const pic = pics[0]
    const file = files[0]

    const product: any = new Schemas.Product({
      ...body,
      author: _id
    })

    product.picture = await uploadFirebase(
      pic.originalname,
      _id,
      product._id,
      product.version,
      pic.buffer
    )
    product.download_url = await uploadFirebase(
      file.originalname,
      _id,
      product._id,
      product.version,
      file.buffer
    )

    await product.save()

    res.json(product)
  } catch (e) {
    console.error(e)
    return sendError(res)
  }
})

export default products
