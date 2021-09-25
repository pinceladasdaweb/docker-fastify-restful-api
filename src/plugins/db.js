const {
  NODE_ENV,
  MONGODB_HOST,
  MONGODB_USERNAME,
  MONGODB_PASSWORD,
  MONGODB_DATABASE
} = require('../environment')

const mongoose = require('mongoose')
const fastifyPlugin = require('fastify-plugin')

async function dbConnector (fastify, options, next) {
  try {
    const url = `mongodb://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@${MONGODB_HOST}/${MONGODB_DATABASE}?authSource=${MONGODB_DATABASE}&retryWrites=true`

    mongoose.set('debug', NODE_ENV === 'development')

    await mongoose
      .connect(url, { autoIndex: true })
      .then(data => {
        fastify.log.info('MongoDB is connected')

        fastify.decorate('mongo', data)
      })
      .catch(err => fastify.log.error(err))
  } catch (err) {
    fastify.log.error(err)
  }

  next()
}

module.exports = fastifyPlugin(dbConnector)
