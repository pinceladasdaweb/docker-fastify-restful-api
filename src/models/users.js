const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const { SALT } = require('../environment')
const mongooseDelete = require('mongoose-delete')
const mongooseTimestamp = require('mongoose-timestamp')
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
  usePushEach: true
})

Schema.pre('save', function (next) {
  this.password = bcrypt.hashSync(this.password, parseInt(SALT, 10))

  next()
})

Schema.plugin(mongoosePaginate)
Schema.plugin(mongooseTimestamp)
Schema.plugin(mongooseDelete, {
  deletedAt: true,
  indexFields: true,
  overrideMethods: true
})

module.exports = mongoose.model('users', Schema)
