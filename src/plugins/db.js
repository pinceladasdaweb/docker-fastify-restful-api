const mongoose = require('mongoose')
const { fromEnv } = require('../utils')
const fastifyPlugin = require('fastify-plugin')

const MAX_RETRIES = 30
const RETRY_INTERVAL = 5000

async function connectWithRetry (fastify, retryCount = 0) {
  const url = `mongodb${JSON.parse(fromEnv.bool('MONGODB_SRV')) ? '+srv' : ''}://${fromEnv('MONGODB_USERNAME')}:${fromEnv('MONGODB_PASSWORD')}@${fromEnv('MONGODB_HOST')}/${fromEnv('MONGODB_DATABASE')}?retryWrites=true&w=majority`

  mongoose.set('strictQuery', true)
  mongoose.set('debug', fromEnv('NODE_ENV') === 'development')

  if (mongoose.connection.readyState !== 1) {
    try {
      await mongoose.connect(url, {
        autoIndex: true,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000
      })

      fastify.log.info('MongoDB is connected')
    } catch (err) {
      fastify.log.error(`Failed to connect to MongoDB: ${err.message}`)

      if (retryCount < MAX_RETRIES) {
        fastify.log.info(`Retrying in ${RETRY_INTERVAL / 1000} seconds... (Attempt ${retryCount + 1}/${MAX_RETRIES})`)

        setTimeout(() => connectWithRetry(fastify, retryCount + 1), RETRY_INTERVAL)
      } else {
        fastify.log.error('Max retries reached. Unable to connect to MongoDB')

        process.exit(1)
      }
    }
  }
}

async function dbConnector (fastify, _options) {
  await connectWithRetry(fastify)

  if (!fastify.mongo) {
    fastify.decorate('mongo', mongoose)
  }
}

module.exports = fastifyPlugin(dbConnector, { name: 'dbConnector' })
