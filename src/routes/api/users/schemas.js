const bodyCreateSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    email: {
      type: 'string',
      format: 'email'
    },
    password: { type: 'string' }
  },
  required: ['name', 'email', 'password']
}

const bodyAuthSchema = {
  type: 'object',
  properties: {
    email: {
      type: 'string',
      format: 'email'
    },
    password: { type: 'string' }
  },
  required: ['email', 'password']
}

const responseCreateSchema = {
  _id: { type: 'string' },
  deleted: { type: 'boolean' },
  name: { type: 'string' },
  email: { type: 'string' },
  updatedAt: { type: 'string' },
  createdAt: { type: 'string' },
  __v: { type: 'number' }
}

const responseAuthSchema = {
  token: { type: 'string' }
}

const createSchema = {
  body: bodyCreateSchema,
  response: {
    201: {
      type: 'object',
      properties: responseCreateSchema
    }
  }
}

const authSchema = {
  body: bodyAuthSchema,
  response: {
    200: {
      type: 'object',
      properties: responseAuthSchema
    }
  }
}

module.exports = {
  authSchema,
  createSchema
}
