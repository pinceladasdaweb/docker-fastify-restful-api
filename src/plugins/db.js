const mongoose = require('mongoose')
const { fromEnv } = require('../utils')
const fastifyPlugin = require('fastify-plugin')

async function dbConnector (fastify, options, next) {
  try {
    const url = `mongodb${JSON.parse(fromEnv('MONGODB_SRV').toLowerCase()) ? '+srv' : ''}://${fromEnv('MONGODB_USERNAME')}:${fromEnv('MONGODB_PASSWORD')}@${fromEnv('MONGODB_HOST')}/${fromEnv('MONGODB_DATABASE')}?retryWrites=true&w=majority`

    mongoose.set('debug', fromEnv('NODE_ENV') === 'development')

    await mongoose
      .connect(url, {
        autoIndex: true
      })
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
