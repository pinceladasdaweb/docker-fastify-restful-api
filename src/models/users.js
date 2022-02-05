const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const { fromEnv } = require('../utils')
const mongooseDelete = require('mongoose-delete')
const mongoosePaginate = require('mongoose-paginate-v2')

/**
* Namespace: Users
*/
const Schema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true
  },
  email: {
    type: String,
    trim: true,
    index: true,
    required: true
  },
  password: {
    type: String,
    trim: true,
    index: true,
    required: true
  }
}, {
  timestamps: true,
  usePushEach: true
})

Schema.pre('save', function (next) {
  this.password = bcrypt.hashSync(this.password, parseInt(fromEnv('SALT'), 10))

  next()
})

Schema.plugin(mongoosePaginate)
Schema.plugin(mongooseDelete, {
  deletedAt: true,
  indexFields: true,
  overrideMethods: true
})

module.exports = mongoose.model('Users', Schema)
