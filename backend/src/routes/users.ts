import { Router } from 'express'
import { isValidObjectId, sendError, stripe, JWT } from '../helpers'
import { Schemas } from '../database/'

const users = Router()

users.use(JWT.authenticate)

users.use('/:id/*', (req, res, next) => {
  const id = req.params['id']

  if (id && !isValidObjectId(id)) {
    return sendError(res, 'Invalid user')
  }

  next()
})

users.get('/:id/cart', async (req, res) => {
  try {
    const id = req.params['id']

    const cart = await Schemas.User
      .findById(id)
      .select('cart')
      .populate('cart')
      .lean()
    res.json(cart)
  } catch (e) {
    console.log(e)
    return sendError(res)
  }
})

users.use('/:id/*', async (req, res, next) => {
  const body = req.body

  if (!body) {
    return sendError(res, 'No body found', 400)
  }

  if (!body.product) {
    return next()
  }

  if (!isValidObjectId(body.product)) {
    return sendError(res, 'Invalid product')
  }

  try {
    const exists = await Schemas.Product.exists({ _id: body.product })
    if (!exists) {
      return sendError(res, 'Product does not exist')
    }
  } catch (e) {
    return sendError(res, e.message)
  }

  next()
})

users.put('/:id/cart', async (req, res) => {
  try {
    const id = req.params['id']
    const { product } = req.body

    await Schemas.User.findByIdAndUpdate(id, { $push: { cart: product } })

    res.sendStatus(204)
  } catch (e) {
    console.log(e)
    return sendError(res)
  }
})

users.delete('/:id/cart', async (req, res) => {
  try {
    const id = req.params['id']
    const { product } = req.body

    await Schemas.User.findByIdAndUpdate(id, { $pull: { cart: product } })

    res.sendStatus(204)
  } catch (e) {
    console.log(e)
    return sendError(res)
  }
})

users.put('/:id/product', async (req, res) => {
  try {
    const userId = req.params['id']
    const { id, status } = req.body

    if (status !== 'succeeded') {
      return sendError(res, 'Payment did not succeeded', 400)
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(id)
    if (!paymentIntent) {
      return sendError(res, 'Payment not found', 400)
    }

    if (paymentIntent.status !== 'succeeded') {
      return sendError(res, 'Payment did not succeeded', 400)
    }

    // @ts-ignore
    if (paymentIntent.customer !== req.user.customerId) {
      return sendError(res, 'You do not own this product... Stop hacking...', 403)
    }

    await Schemas.User.findByIdAndUpdate(userId, {
      $push: {
        products_bought: {
          $each: JSON.parse(paymentIntent.metadata.products)
        }
      },
      $set: {
        cart: []
      }
    })

    res.sendStatus(204)
  } catch (e) {
    console.log(e)
    return sendError(res)
  }
})

export default users
