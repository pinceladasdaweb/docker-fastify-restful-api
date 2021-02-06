const mongoose = require('mongoose')
const slug = require('mongoose-slug-generator')
const mongooseDelete = require('mongoose-delete')
const mongoosePaginate = require('mongoose-paginate-v2')
const { genresEnum, languagesEnum, countryCodesEnum } = require('../enums')

/**
* Namespace: Movies
*/
const Schema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    index: true,
    required: true
  },
  slug: {
    type: String,
    index: true,
    slug: ['title', 'year']
  },
  year: {
    type: Number,
    required: true
  },
  releasedAt: {
    type: Date
  },
  genres: [{
    type: String,
    enum: genresEnum,
    index: true,
    required: true
  }],
  director: {
    type: String,
    trim: true,
    index: true,
    required: true
  },
  writers: {
    type: String,
    trim: true,
    index: true,
    required: true
  },
  actors: {
    type: String,
    trim: true,
    index: true,
    required: true
  },
  description: {
    type: String,
    trim: true,
    required: true
  },
  languages: [{
    type: String,
    enum: languagesEnum,
    index: true,
    required: true
  }],
  country: {
    type: String,
    enum: countryCodesEnum,
    index: true,
    required: true
  },
  imdbID: {
    type: String,
    trim: true,
    index: true,
    required: true
  }
}, {
  timestamps: true,
  usePushEach: true
})

Schema.plugin(slug)
Schema.plugin(mongoosePaginate)
Schema.plugin(mongooseDelete, {
  deletedAt: true,
  indexFields: true,
  overrideMethods: true
})

module.exports = mongoose.model('Movies', Schema)
