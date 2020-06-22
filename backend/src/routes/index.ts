import { Router } from 'express'

import products from './products'
import payments from './payments'
import auth from './auth'
import users from './users'

const router = Router()

router.use('/products', products)
router.use('/payments', payments)
router.use('/users', users)
router.use('/auth', auth)

export default router
