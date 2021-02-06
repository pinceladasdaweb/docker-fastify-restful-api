const {
  genresEnum,
  languagesEnum,
  countryCodesEnum
} = require('../../../enums')

const commom = {
  title: { type: 'string' },
  year: { type: 'number' },
  releasedAt: { type: 'string' },
  genres: {
    type: 'array',
    items: {
      type: 'string',
      enum: genresEnum
    }
  },
  director: { type: 'string' },
  writers: { type: 'string' },
  actors: { type: 'string' },
  description: { type: 'string' },
  languages: {
    type: 'array',
    items: {
      type: 'string',
      enum: languagesEnum
    }
  },
  country: { type: 'string', enum: countryCodesEnum },
  imdbID: { type: 'string' }
}

const bodyCreateSchema = {
  type: 'object',
  properties: commom,
  required: ['title', 'year', 'releasedAt', 'genres', 'director', 'writers', 'actors',
    'description', 'languages', 'country', 'imdbID']
}

const responseSchema = {
  _id: { type: 'string' },
  slug: { type: 'string' },
  ...commom,
  deleted: { type: 'boolean' },
  updatedAt: { type: 'string' },
  createdAt: { type: 'string' },
  __v: { type: 'number' }
}

const listSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        docs: {
          type: 'array',
          items: {
            type: 'object',
            properties: responseSchema
          }
        },
        total: { type: 'number' },
        limit: { type: 'number' },
        pages: { type: 'number' },
        page: { type: 'number' }
      }
    }
  }
}

const createSchema = {
  body: bodyCreateSchema,
  response: {
    201: {
      type: 'object',
      properties: responseSchema
    }
  }
}

module.exports = {
  listSchema,
  createSchema
}
