const mongoose = require('mongoose')
const { fromEnv } = require('../shared/utils')
const fastifyPlugin = require('fastify-plugin')

const MAX_RETRIES = 30
const RETRY_INTERVAL = 5000

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

const buildUrl = () => {
  const protocol = fromEnv.bool('MONGODB_SRV', false) ? 'mongodb+srv' : 'mongodb'
  const username = encodeURIComponent(fromEnv('MONGODB_USERNAME'))
  const password = encodeURIComponent(fromEnv('MONGODB_PASSWORD'))

  return `${protocol}://${username}:${password}@${fromEnv('MONGODB_HOST')}/${fromEnv('MONGODB_DATABASE')}?retryWrites=true&w=majority`
}

async function connectWithRetry (fastify) {
  const url = buildUrl()

  mongoose.set('strictQuery', true)
  mongoose.set('debug', fromEnv('NODE_ENV') === 'development')

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      await mongoose.connect(url, {
        autoIndex: true,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000
      })

      fastify.log.info('MongoDB is connected')

      return
    } catch (err) {
      fastify.log.error(`Failed to connect to MongoDB: ${err.message}`)

      if (attempt === MAX_RETRIES) {
        throw new Error('Max retries reached. Unable to connect to MongoDB')
      }

      fastify.log.info(`Retrying in ${RETRY_INTERVAL / 1000} seconds... (Attempt ${attempt}/${MAX_RETRIES})`)

      await delay(RETRY_INTERVAL)
    }
  }
}

async function dbConnector (fastify, _options) {
  if (mongoose.connection.readyState !== 1) {
    await connectWithRetry(fastify)
  }

  if (!fastify.mongo) {
    fastify.decorate('mongo', mongoose)
  }

  fastify.addHook('onClose', () => mongoose.connection.close())
}

module.exports = fastifyPlugin(dbConnector, { name: 'dbConnector' })
