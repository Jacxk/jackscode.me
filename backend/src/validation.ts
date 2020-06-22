import Joi from '@hapi/joi';

export function newUser(data) {
  const schema = Joi.object({
    username: Joi
      .string()
      .alphanum()
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
      .max(50)
      .required(),
    page_content: Joi
      .string()
      .min(50)
      .max(2056)
      .required(),
    picture: Joi
      .string()
      .base64()
      .required(),
    price: Joi
      .number()
      .min(100)
      .max(5000)
      .required(),
    version: Joi
      .string()
      .min(1)
      .required()
  })

  return schema.validate(data)
}

export function productUpdate(data) {
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
      .max(2056),
    picture: Joi
      .string()
      .base64(),
    price: Joi
      .number()
      .min(100)
      .max(5000),
    version: Joi
      .string()
      .min(1)
      .required()
  })

  return schema.validate(data)
}