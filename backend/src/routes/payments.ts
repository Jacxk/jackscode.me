import { Router } from 'express'
import { JWT, sendError, stripe } from '../helpers'

const payments = Router()

payments.use(JWT.authenticate)

payments.post('/create', async (req, res) => {
  try {
    const { amount, products, receipt_email } = req.body

    const { client_secret } = await stripe.paymentIntents.create({
      amount: Math.floor(amount * 100),
      currency: 'usd',
      // @ts-ignore
      customer: req.user.customerId,
      receipt_email,
      metadata: {
        integration_check: 'accept_a_payment',
        products: JSON.stringify(products)
      }
    })
    res.json({ client_secret })
  } catch (e) {
    console.log(e)
    return sendError(res)
  }
})

payments.post('/update', async (req, res) => {
  try {
    const { amount, secret, receipt_email, products } = req.body

    const { client_secret } = await stripe.paymentIntents.update(secret, {
      amount: Math.floor(amount * 100),
      currency: 'usd',
      receipt_email,
      metadata: {
        integration_check: 'accept_a_payment',
        products: JSON.stringify(products)
      }
    })
    res.json({ client_secret })
  } catch (e) {
    console.log(e)
    return sendError(res)
  }
})

export default payments
