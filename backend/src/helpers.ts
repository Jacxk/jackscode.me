import { Schemas } from './database/'
import { Response } from 'express'
import { Types } from 'mongoose'
import * as Firebase from 'firebase-admin'

import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import Stripe from 'stripe'

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

      jwt.verify(token, secret, async (err) => {
        if (err) {
          return sendError(res, 'Forbidden', 403)
        }

        try {
          const user = await Schemas.User
            .findOne({ token })
            .select('-password')
            .populate('ratings_given')
            .lean()
            .exec()
          if (!user) {
            return sendError(res, 'Unauthorized', 401)
          }

          req.user = user
        } catch {
          return sendError(res)
        }

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

export function isValidObjectId(id) {
  const object = Types.ObjectId(id)
  return object.equals(id)
}

export async function uploadFirebase(
  fileName: string,
  user: string,
  product: string,
  version: string,
  buffer: Buffer,
  image?: Boolean
) {
  const storage = Firebase.storage()
  const bucket = storage.bucket()
  const file = bucket.file(`products/${ user }/${ product }/${ version }/${ fileName }`)

  await file.save(buffer, { contentType: 'auto' })

  const firebase_url = 'https://firebasestorage.googleapis.com'
  const name = image ? file.name.replace(/(.*)(\..*)/, '$1.webp') : file.name
  const filePath = encodeURIComponent(name)
  return `${ firebase_url }/v0/b/${ bucket.name }/o/${ filePath }?alt=media`
}

export function calculateRating(...ratings: Array<number>): number {
  if (ratings.length !== 5) return 0

  let res = ratings.reduce((a, b, i) => a + ((i + 1) * b), 0)
  res /= ratings.reduce((a, b) => a + b)

  return Number(res.toFixed(2))
}

export async function clearNotifications(user) {
  await Schemas.User
    .findByIdAndUpdate(user, { $set: { notifications: 0 } })
    .exec()
}

export const stripe = new Stripe(process.env.STRIPE_API_KEY, null)
