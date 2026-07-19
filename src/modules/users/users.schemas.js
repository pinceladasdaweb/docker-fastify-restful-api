const bodyCreateSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    email: {
      type: 'string',
      format: 'email'
    },
    password: {
      type: 'string',
      minLength: 8
    }
  },
  required: ['name', 'email', 'password'],
  errorMessage: {
    required: {
      name: 'name is required.',
      email: 'email is required.',
      password: 'password is required.'
    },
    properties: {
      email: 'should be match a email.',
      password: 'password must be at least 8 characters long.'
    }
  }
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
  required: ['email', 'password'],
  errorMessage: {
    required: {
      email: 'email is required.',
      password: 'password is required.'
    },
    properties: {
      email: 'should be match a email.'
    }
  }
}

const responseCreateSchema = {
  _id: { type: 'string' },
  name: { type: 'string' },
  email: { type: 'string' },
  updatedAt: { type: 'string' },
  createdAt: { type: 'string' }
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
