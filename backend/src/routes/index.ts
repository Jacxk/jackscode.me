import { Router } from 'express'

import products from './products'
import ratings from './ratings'
import payments from './payments'
import auth from './auth'
import users from './users'

const router = Router()

router.use('/ping', (_, res) => res.send('pong'))
router.use('/products', products)
router.use('/ratings', ratings)
router.use('/payments', payments)
router.use('/users', users)
router.use('/auth', auth)

export default router
