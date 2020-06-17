import { Router } from 'express'
import jwt from 'jsonwebtoken'

const auth = Router()

const secret = 'iloveyou'

const users = [
  {
    username: 'john@g.c',
    password: 'password123admin',
    role: 'admin'
  },
  {
    username: 'anna',
    password: 'password123member',
    role: 'member'
  }
]
const books = [
  {
    author: 'Chinua Achebe',
    country: 'Nigeria',
    language: 'English',
    pages: 209,
    title: 'Things Fall Apart',
    year: 1958
  },
  {
    author: 'Hans Christian Andersen',
    country: 'Denmark',
    language: 'Danish',
    pages: 784,
    title: 'Fairy tales',
    year: 1836
  },
  {
    author: 'Dante Alighieri',
    country: 'Italy',
    language: 'Italian',
    pages: 928,
    title: 'The Divine Comedy',
    year: 1315
  }
]

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (authHeader) {
    const token = authHeader.split(' ')[1]

    jwt.verify(token, secret, (err, user) => {
      if (err) {
        return res.sendStatus(403)
      }

      req.user = user
      next()
    })
  } else {
    res.sendStatus(401)
  }
}

auth.post('/login', function(req, res) {
  try {
    const { username, password } = req.body

    const user = users.find((u) => {
      return u.username === username && u.password === password
    })
    if (user) {
      const token = jwt.sign(
        {
          username: user.username,
          role: user.role
        },
        secret
      )

      res.json({ token })
    } else {
      res.json({ error: 'Username or password incorrect' })
    }
  } catch (e) {
    res.json({ status: 500, message: 'Internal error!' })
  }
})

auth.get('/books', authenticateJWT, (_, res) => {
  res.json(books)
})

export default auth
