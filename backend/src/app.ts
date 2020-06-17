import express from 'express'
// @ts-ignore
import cookieParser from 'cookie-parser'
import { getStatus } from './helpers'

import routes from './routes'

const app = express()
const port: number = parseInt(process.env.BE_PORT) || 3000
const host: string = process.env.BE_HOST || 'localhost'

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use('/api', routes)

app.use((_, res) => {
  res.json({ error: 'Invalid endpoint' })
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
