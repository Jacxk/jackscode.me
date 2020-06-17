import { Router } from 'express'
import { Schemas } from '../database'

const products = Router()

products.get('/products', async function(_, res) {
  try {
    const products = await Schemas.Product.find({}).lean()
    res.json(products)
  } catch (e) {
    console.error(e)
    res.json({ status: 500, message: 'Internal error!' })
  }
})

products.get('/products/:id', async function(req, res) {
  try {
    const product = await Schemas.Product.findById(req.params.id).lean()
    res.json(product)
  } catch (e) {
    console.error(e)
    res.json({ status: 500, message: 'Internal error!' })
  }
})

products.post('/products', async function(req, res) {
  try {
    const product = new Schemas.Product(req.body)
    await product.save()
    res.json(product)
  } catch (e) {
    console.error(e)
    res.json({ status: 500, message: 'Internal error!' })
  }
})

export default products
