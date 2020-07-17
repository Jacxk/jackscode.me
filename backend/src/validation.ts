import Joi from '@hapi/joi'
import { sendError } from './helpers'

export function newUser(data) {
  const schema = Joi.object({
    username: Joi
      .string()
      .min(2)
      .max(30)
      .required(),
    password: Joi
      .string()
      .min(6)
      .max(32)
      .required(),
    email: Joi
      .string()
      .email()
      .required()
  })

  return schema.validate(data)
}

export function returningUser(data) {
  const schema = Joi.object({
    password: Joi
      .string()
      .min(6)
      .max(32)
      .required(),
    email: Joi
      .string()
      .min(6)
      .email()
      .required()
  })

  return schema.validate(data)
}

export function newProduct(data) {
  const schema = Joi.object({
    name: Joi
      .string()
      .min(5)
      .max(100)
      .required(),
    description: Joi
      .string()
      .min(5)
      .max(300)
      .required(),
    page_content: Joi
      .string()
      .min(50)
      .max(2056)
      .required(),
    price: Joi
      .number()
      .positive()
      .precision(2)
      .min(0)
      .max(50)
      .required(),
    version: Joi
      .string()
      .min(1)
      .required()
  })

  return schema.validate(data)
}

export function productEdit(data) {
  const schema = Joi.object({
    name: Joi
      .string()
      .min(5)
      .max(100),
    description: Joi
      .string()
      .min(5)
      .max(50),
    page_content: Joi
      .string()
      .min(50)
      .max(8000),
    picture: Joi
      .string()
      .base64(),
    price: Joi
      .number()
      .min(1)
      .max(50)
  })

  return schema.validate(data)
}

export function versionUpdate(data) {
  const schema = Joi.object({
    title: Joi
      .string()
      .min(5)
      .required(),
    version: Joi
      .string()
      .min(1)
      .required(),
    change_log: Joi
      .string()
      .min(5),
    product: Joi
      .string()
      .required()
  })

  return schema.validate(data)
}

export function newRating(data) {
  const schema = Joi.object({
    stars: Joi
      .number()
      .min(1)
      .max(5)
      .required(),
    content: Joi
      .string()
      .required(),
    product: Joi
      .string()
      .required(),
    version: Joi
      .string()
      .required()
  })

  return schema.validate(data)
}

export function hasFiles(res, picture, file) {
  if (!picture) {
    sendError(res, '"picture" not found on request', 400)
    return false
  }
  if (!file) {
    sendError(res, '"file" not found on request', 400)
    return false
  }

  return true
}
