import { Router } from 'express'

import products from './products'
import auth from './auth'

const router = Router()

router.use('/', products)
router.use('/auth', auth)

export default router
