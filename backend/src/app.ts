import express from 'express'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import { getStatus } from './helpers'

import routes from './routes'


const app = express()
const port: number = parseInt(process.env.SERVER_PORT) || 3000
const host: string = process.env.SERVER_HOST || 'localhost'

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use(morgan('dev'))
app.use('/api', routes)

app.use((_, res) => {
  res.status(404).json({ error: 'Invalid endpoint' })
})

app.use((error, req, res, _) => {
  const statusCode = getStatus(error.status)

  res.status(statusCode).json({ error: error._message || error.message })

  console.error(error)
})

app.listen(port, host, () => {
  console.error(`Listening on http://localhost:${ port }`)
})

export {}
