const { Router } = require('express')

const backend = Router()

backend.use(require('./api'))
backend.use('/auth', require('./auth'))

module.exports = backend
