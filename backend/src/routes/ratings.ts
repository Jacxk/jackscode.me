import { Router } from 'express'
import { calculateRating, JWT, sendError } from '../helpers'
import { Schemas } from '../database/'
import { newRating } from '../validation'

const ratings = Router()

ratings.get('/:id', async (req, res) => {
  try {
    const id = req.params['id']

    const rating = await Schemas.Rating
      .findById(id)
      .populate('product')
      .populate('version')
      .populate('created_by')
      .lean()
      .exec()

    res.json(rating)
  } catch (e) {
    console.log(e)
    return sendError(res)
  }
})

ratings.get('/user/:id', async (req, res) => {
  try {
    const id = req.params['id']

    const ratings = await Schemas.Rating
      .find({ created_by: id })
      .populate('product')
      .populate('version')
      .populate('created_by')
      .lean()
      .exec()

    res.json(ratings)
  } catch (e) {
    console.log(e)
    return sendError(res)
  }
})

ratings.get('/product/:id', async (req, res) => {
  try {
    const id = req.params['id']

    const ratings = await Schemas.Rating
      .find({ product: id })
      .populate('product')
      .populate('version')
      .populate('created_by')
      .sort('created_at')
      .lean()
      .exec()

    res.json(ratings)
  } catch (e) {
    console.log(e)
    return sendError(res)
  }
})

ratings.use(JWT.authenticate)

ratings.put('/product/:id', async (req, res) => {
  try {
    const body = req.body

    const { error } = newRating(body)
    if (error) {
      return sendError(res, error.message, 400)
    }

    const user: any = await Schemas.User
      // @ts-ignore
      .findById(req.user._id)
      .select('ratings_given products_bought')
      .populate('ratings_given', 'version')
      .populate('products_bought', 'price')
      .lean()
      .exec()

    // @ts-ignore
    const owns = await Schemas.Product.findOne({ author: req.user._id })

    if (owns) {
      return sendError(res, 'You cannot rate your own products', 403)
    }

    if (user.products_bought.price > 0 && !user.products_bought.some(product => product._id === body.product)) {
      return sendError(res, 'You need to buy this product first.', 403)
    }

    if (user.ratings_given.some(rating => rating.version + '' === body.version)) {
      return sendError(res, 'You already rated this version.', 403)
    }

    const rating = new Schemas.Rating({
      ...body,
      // @ts-ignore
      created_by: req.user._id
    })
    await rating.save()

    await Schemas.User
      // @ts-ignore
      .findByIdAndUpdate(req.user._id, {
        $push: {
          ratings_given: rating._id
        }
      })
      .exec()

    const product: any = await Schemas.Product
      .findByIdAndUpdate(body.product, {
        $push: {
          ratings: rating._id
        }
      })
      .populate('ratings', 'stars')
      .exec()

    const ratings: Array<any> = product.ratings
    ratings.push(rating)

    const total = [ 1, 2, 3, 4, 5 ]
      .map(i => ratings.filter(rating => rating.stars === i).length)

    product.rating = calculateRating(...total)

    await Schemas.Product
      .findByIdAndUpdate(body.product, { rating: product.rating })
      .exec()

    // @ts-ignore
    res.json({ ...rating._doc, overall_rating: product.rating })

  } catch (e) {
    console.error(e)
    return sendError(res)
  }
})

export default ratings
