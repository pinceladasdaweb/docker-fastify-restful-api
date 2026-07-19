const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const { fromEnv } = require('../../shared/utils')
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
    unique: true,
    lowercase: true,
    required: true
  },
  password: {
    type: String,
    trim: true,
    required: true
  }
}, {
  timestamps: true,
  usePushEach: true
})

Schema.pre('save', async function () {
  if (!this.isModified('password')) {
    return
  }

  this.password = await bcrypt.hash(this.password, fromEnv.int('SALT', 10))
})

Schema.plugin(mongoosePaginate)
Schema.plugin(mongooseDelete, {
  deletedAt: true,
  indexFields: true,
  overrideMethods: true
})

module.exports = mongoose.model('Users', Schema)
