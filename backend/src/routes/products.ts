import { Router } from 'express'
import { Schemas } from '../database'
import { newProduct } from '../validation'
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

products.get('/', async function(_, res) {
  try {
    const products = await Schemas.Product
      .find({})
      .populate('author', 'username')
      .lean()
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
    res.json(product)
  } catch (e) {
    console.error(e)
    return sendError(res)
  }
})

products.post('/', JWT.authenticate, upload, async function(req, res) {
  try {
    const body = req.body

    if (body.picture_file) {
      return sendError(res, '"picture" not found on request', 400)
    }
    if (body.file) {
      return sendError(res, '"file" not found on request', 400)
    }

    const { error } = newProduct(body)
    if (error) {
      return sendError(res, error.message, 400)
    }

    const { role, username, _id }: any = req.user

    if (role !== 'seller') {
      return sendError(res, 'Forbidden', 403)
    }

    // @ts-ignore
    const pics = req.files.picture_file
    // @ts-ignore
    const files = req.files.file

    if (!pics) {
      return sendError(res, '"picture" not found on request', 400)
    }
    if (!files) {
      return sendError(res, '"file" not found on request', 400)
    }

    const pic = pics[0]
    const file = files[0]

    const picture = await uploadFirebase(
      pic.originalname,
      username,
      body.name,
      pic.buffer
    )
    const download_url = await uploadFirebase(
      file.originalname,
      username,
      body.name,
      file.buffer
    )

    const product = new Schemas.Product({
      ...body,
      author: _id,
      picture,
      download_url
    })
    await product.save()

    res.json(product)
  } catch (e) {
    console.error(e)
    return sendError(res)
  }
})

export default products
