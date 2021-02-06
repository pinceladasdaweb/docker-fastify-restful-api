const bodySchema = {
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

const responseSchema = {
  _id: { type: 'string' },
  deleted: { type: 'boolean' },
  name: { type: 'string' },
  email: { type: 'string' },
  updatedAt: { type: 'string' },
  createdAt: { type: 'string' },
  __v: { type: 'number' }
}

const createSchema = {
  body: bodySchema,
  response: {
    201: {
      type: 'object',
      properties: responseSchema
    }
  }
}

module.exports = {
  createSchema
}
