import { Router } from 'express'
import { JWT, Password, sendError, stripe } from '../helpers'
import { Schemas } from '../database/'
import { newUser, returningUser } from '../validation'

const auth = Router()

auth.post('/register', async (req, res) => {
  try {
    const body = req.body

    const { error } = newUser(body)

    if (error) {
      return sendError(res, error.message, 400)
    }

    const { email, password, username } = body
    const exists = await Schemas.User.exists({ email })

    if (exists) {
      return sendError(res, 'Email already exists', 400)
    }

    const customer = await stripe.customers.create({
      email,
      name: username
    })

    let user: any = new Schemas.User({
      ...body,
      customerId: customer.id,
      password: await Password.hash(password)
    })
    user.token = JWT.createAccessToken(Object.assign({}, user)._doc)

    await user.save()
    delete user.password

    res.json(user)

  } catch (e) {
    console.log(e)
    return sendError(res)
  }
})

auth.post('/login', async (req, res) => {
  try {
    const body = req.body
    const { error } = returningUser(body)
    if (error) {
      return sendError(res, error.message, 400)
    }

    const user: any = await Schemas.User
      .findOne({ email: body.email })
      .lean()
      .exec()

    if (!user) {
      return sendError(res, 'Incorrect email', 400)
    }

    const valid = await Password.isValid(body.password, user.password)
    if (!valid) {
      return sendError(res, 'Incorrect password', 400)
    }

    res.json({ token: user.token })
  } catch (e) {
    console.log(e)
    return sendError(res)
  }
})

auth.get('/user', JWT.authenticate, async (req, res) => {
  try {
    const user = await Schemas.User
      // @ts-ignore
      .findById(req.user._id)
      .select('-password')
      .populate('products_bought')
      .populate('cart')
      .lean()
      .exec()
    return res.json(user)
  } catch (e) {
    console.log(e)
    return sendError(res)
  }
})

export default auth
