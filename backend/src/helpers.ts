import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { Schemas } from './database/'
import { Response } from 'express'

const secret = process.env.ACCESS_TOKEN_SECRET || 'youllneverfindme'

export function getStatus(code: number) {
  if (code && code >= 100 && code < 600) {
    return code
  }

  return 500
}

export function sendError(res: Response, error = 'Internal Error', code = 500) {
  res.status(code).json({ error })
}

export const JWT = {
  authenticate(req, res, next) {
    const authHeader = req.headers.authorization

    if (authHeader) {
      const [ type, token ] = authHeader.split(' ')

      if (type !== 'Bearer') {
        return sendError(res, 'Authentication header must be "Bearer"', 400)
      }

      jwt.verify(token, secret, async (err, user) => {
        if (err) {
          return sendError(res, 'Forbidden', 403)
        }

        try {
          const exists = await Schemas.User.findOne({ token })
          if (!exists) {
            return sendError(res, 'Unauthorized', 401)
          }
        } catch {
          return sendError(res)
        }

        req.user = user
        next()
      })
    } else {
      return sendError(res, 'Unauthorized', 401)
    }
  },
  createAccessToken(user) {
    return jwt.sign(user, secret)
  }
}

export const Password = {
  async hash(password) {
    const salt = await bcrypt.genSalt(11)
    return await bcrypt.hash(password, salt)
  },
  async isValid(password, compare) {
    return await bcrypt.compare(password, compare)
  }
}
