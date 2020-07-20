import { Router } from 'express'
import { Schemas } from '../database'
import { hasFiles, newProduct, productEdit, versionUpdate } from '../validation'
import { JWT, sendError, uploadFirebase } from '../helpers'
import { v4 as uuid } from 'uuid'
import { storage } from 'firebase-admin'
import * as Firebase from 'firebase-admin'
import Multer from 'multer'
import got from 'got'
import client from '../socket'

const products = Router()

const bucket = storage().bucket()

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
      .populate('latest_version', 'created_at')
      .lean()
      .exec()
    res.json(products)
  } catch (e) {
    console.error(e)
    return sendError(res)
  }
})

products.get('/hot', async function(req, res) {
  try {
    const config = await Firebase.remoteConfig().getTemplate()
    const hotProducts: string = config.parameters.hot_items.defaultValue['value']

    const products = await Schemas.Product
      .find({ _id: { $in: JSON.parse(hotProducts) } })
      .select('-page_content -old_versions -latest_version -versions -download_url')
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

products.post('/:id/update', multer.single('file'), async function(req, res) {
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

    const product: any = await Schemas.Product
      .findByIdAndUpdate(id, {
        $push: {
          versions: version
        },
        $set: {
          latest_version: version,
          version: body.version
        }
      })
      .populate('author')
      .lean()
      .exec()

    const notification = await new Schemas.Notification({
      product: product._id,
      version: version._id
    })
    await notification.save()

    await Schemas.User.updateMany(
      { products_bought: { $in: product._id } },
      { $inc: { notifications: 1 } }
    )

    await version.save()

    client.emit('PRODUCT_UPDATE', {
      secret: process.env.SOCKET_SECRET,
      data: product
    })
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
      title: 'First Release',
      product: product._id,
      version: body.version
    })

    product.latest_version = version._id
    product.picture = await uploadFirebase(
      pic.originalname,
      _id,
      product._id,
      product.version,
      pic.buffer,
      /image\/.*/.test(pic.mimetype)
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

    await Schemas.User.findByIdAndUpdate(_id, {
      $push: {
        products_created: product._id
      }
    })

    res.json(product)
  } catch (e) {
    console.error(e)
    return sendError(res)
  }
})

products.get('/:id/download', async (req, res) => {
  try {
    const bought = await Schemas.User.exists({
      $or: [
        {
          products_bought: {
            $in: [ req.params.id ]
          }
        },
        {
          products_created: {
            $in: [ req.params.id ]
          }
        }
      ]
    })
    if (!bought) {
      return sendError(res, 'You do not own this product', 403)
    }

    const query = req.query
    if (!query.version) {
      return sendError(res, 'No product version found on body', 400)
    }

    const { download_url }: any = await Schemas.Version
      .findById(query.version)
      .select('download_url')
      .lean()
      .exec()

    const [ match ] = download_url.match(/products.*/)
    if (!match) {
      return sendError(res, 'Invalid URL provided', 400)
    }
    const url = decodeURIComponent(match)
    const file = bucket.file(url.replace(/\?.*/g, ''))
    const uid = uuid()

    await file.setMetadata({
      metadata: {
        firebaseStorageDownloadTokens: uid
      }
    })

    const buffer = await got(`${ download_url }&token=${ uid }`).buffer()
    const fileName = download_url.match(/(%2F.*%2F)(.*)\?/)[2]

    res.setHeader('file-name', fileName)
    res.send(buffer)

    await file.setMetadata({
      metadata: {
        firebaseStorageDownloadTokens: uuid()
      }
    })
  } catch (e) {
    console.error(e)
    return sendError(res)
  }
})

products.patch('/:id', async (req, res) => {
  try {
    const body = req.body

    const { error } = productEdit(body)
    if (error) {
      return sendError(res, error.message, 400)
    }

    await Schemas.Product.findByIdAndUpdate(req.params.id, {
      $set: { ...body }
    })

    res.sendStatus(204)

  } catch (e) {
    console.error(e)
    return sendError(res)
  }
})

export default products
