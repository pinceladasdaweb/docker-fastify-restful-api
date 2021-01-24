const {
  NODE_ENV,
  MONGODB_HOST,
  MONGODB_USERNAME,
  MONGODB_PASSWORD,
  MONGODB_DATABASE
} = require('../environment')

const mongoose = require('mongoose')
const fastifyPlugin = require('fastify-plugin')

async function dbConnector (fastify, options) {
  try {
    const url = `mongodb://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@${MONGODB_HOST}/${MONGODB_DATABASE}?authSource=${MONGODB_DATABASE}&retryWrites=true`

    mongoose.set('debug', NODE_ENV === 'development')

    const db = await mongoose
      .connect(url, {
        autoIndex: true,
        useCreateIndex: true,
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true
      })
      .then(_ => fastify.log.info('\x1b[32m%s\x1b[0m', 'MongoDB is connected'))
      .catch(err => fastify.log.error(err))

    fastify.decorate('mongo', db)
  } catch (err) {
    fastify.log.error(err)
  }
}

module.exports = fastifyPlugin(dbConnector)
