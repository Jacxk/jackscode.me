import { Router } from 'express'
import { Schemas } from '../database'
import { hasFiles, newProduct, newRating, versionUpdate } from '../validation'
import { calculateRating, JWT, sendError, uploadFirebase } from '../helpers'

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
      .populate('author', 'username avatar')
      .populate('versions')
      .populate({
        path: 'ratings',
        populate: {
          path: 'created_by'
        }
      })
      .lean()
      .exec()
    res.json(product)
  } catch (e) {
    console.error(e)
    return sendError(res)
  }
})

products.use(JWT.authenticate)

products.patch('/:id', multer.single('file'), async function(req, res) {
  try {
    const body = req.body

    if (!hasFiles(res, true, !body.file)) return

    const { error } = versionUpdate(body)
    if (error) {
      return sendError(res, error.message, 400)
    }

    // @ts-ignore
    const file = req.file
    if (!hasFiles(res, true, file)) return

    const id = req.params.id

    const download_url = await uploadFirebase(
      file.originalname,
      // @ts-ignore
      req.user._id,
      id,
      body.version,
      file.buffer
    )

    const version = new Schemas.Version({
      product: id,
      version: body.version,
      title: body.title,
      change_log: body.change_log,
      download_url
    })

    await Schemas.Product
      .findByIdAndUpdate(id, {
        $push: {
          versions: version
        },
        $set: {
          latest_version: version,
          version: body.version
        }
      })
      .exec()
    await version.save()

    res.sendStatus(204)
  } catch (e) {
    console.error(e)
    return sendError(res)
  }
})

products.post('/', upload, async function(req, res) {
  try {
    const body = req.body

    if (!hasFiles(res, !body.picture_file, !body.file)) return

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

    if (!hasFiles(res, pics, files)) return

    const pic = pics[0]
    const file = files[0]

    const product: any = new Schemas.Product({
      ...body,
      author: _id
    })

    const version: any = new Schemas.Version({
      product: product._id,
      version: body.version
    })

    product.latest_version = version._id
    product.picture = await uploadFirebase(
      pic.originalname,
      _id,
      product._id,
      product.version,
      pic.buffer
    )

    version.download_url = await uploadFirebase(
      file.originalname,
      _id,
      product._id,
      product.version,
      file.buffer
    )

    await product.save()
    await version.save()

    res.json(product)
  } catch (e) {
    console.error(e)
    return sendError(res)
  }
})

export default products
