const {
  genresEnum,
  languagesEnum,
  countryCodesEnum
} = require('../../../enums')

const commom = {
  title: { type: 'string' },
  year: { type: 'number' },
  releasedAt: {
    type: 'string',
    format: 'date-time'
  },
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
  country: {
    type: 'string',
    enum: countryCodesEnum
  },
  imdbID: { type: 'string' }
}

const bodyCreateSchema = {
  type: 'object',
  properties: commom,
  required: ['title', 'year', 'releasedAt', 'genres', 'director', 'writers', 'actors',
    'description', 'languages', 'country', 'imdbID'],
  errorMessage: {
    required: {
      title: 'title is required.',
      year: 'year is required.',
      releasedAt: 'releasedAt is required.',
      genres: 'genres is required.',
      director: 'director is required.',
      writers: 'writers is required.',
      actors: 'actors is required.',
      description: 'description is required.',
      languages: 'languages is required.',
      country: 'country is required.',
      imdbID: 'imdbID is required.'
    },
    properties: {
      releasedAt: 'should be match a valid date-time.'
    }
  }
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

const viewSchema = {
  response: {
    200: {
      type: 'object',
      properties: responseSchema
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

const updateSchema = {
  body: {
    type: 'object',
    properties: {
      ...commom,
      slug: { type: 'string' }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: responseSchema
    }
  }
}

module.exports = {
  listSchema,
  viewSchema,
  createSchema,
  updateSchema
}
