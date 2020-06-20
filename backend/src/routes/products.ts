import { Router } from 'express'
import { Schemas } from '../database'
import { newProduct } from '../validation'

const products = Router()

products.get('/', async function(_, res) {
  try {
    const products = await Schemas.Product.find({}).lean()
    res.json(products)
  } catch (e) {
    console.error(e)
    res.json({ status: 500, message: 'Internal error!' })
  }
})

products.get('/:id', async function(req, res) {
  try {
    const product = await Schemas.Product.findById(req.params.id).lean()
    res.json(product)
  } catch (e) {
    console.error(e)
    res.json({ status: 500, message: 'Internal error!' })
  }
})

products.put('/:id', async function(req, res) {
  // TODO
})

products.post('/', async function(req, res) {
  try {
    const body = req.body;

    const { error } = newProduct(body)
    if (error) {
      return res.status(400).json({ error })
    }

    const product = new Schemas.Product(body)
    await product.save()
    res.json(product)
  } catch (e) {
    console.error(e)
    res.json({ status: 500, message: 'Internal error!' })
  }
})

export default products
