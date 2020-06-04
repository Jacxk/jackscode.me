const { Router } = require('express')
const Schemas = require('./database/Schemas.js')

const api = Router()

api.get('/products', async function(_, res) {
  try {
    const products = await Schemas.Product.find({}).lean()
    res.json(products)
  } catch (e) {
    console.error(e)
    res.json({ status: 500, message: 'Internal error!' })
  }
})

api.get('/product/:id', async function(req, res) {
  try {
    const product = await Schemas.Product.findById(req.params.id).lean()
    res.json(product)
  } catch (e) {
    console.error(e)
    res.json({ status: 500, message: 'Internal error!' })
  }
})

api.post('/products', async function(req, res) {
  try {
    console.log(req.body)
    const product = new Schemas.Product(req.body)
    await product.save()
    res.json(product)
  } catch (e) {
    console.error(e)
    res.json({ status: 500, message: 'Internal error!' })
  }
})

module.exports = api
