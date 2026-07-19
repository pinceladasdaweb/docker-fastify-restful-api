const Fastify = require('fastify')
const { fromEnv } = require('./shared/utils')
const { name, version } = require('../package.json')
const config = require('./shared/utils/config/logger-config')
const { NOT_FOUND, INTERNAL_SERVER_ERROR } = require('./shared/errors')

const REQUIRED_ENVS = ['JWT_SECRET', 'MONGODB_HOST', 'MONGODB_DATABASE']

const assertRequiredEnvs = () => {
  const missing = REQUIRED_ENVS.filter(key => !fromEnv(key))

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }
}

const build = async () => {
  assertRequiredEnvs()

  const fastify = Fastify({
    logger: config,
    trustProxy: true,
    bodyLimit: 1048576 * 10,
    // the db plugin waits for up to 30 connection attempts (~5 min) during boot
    pluginTimeout: 300000
  })

  await fastify.register(require('@fastify/cors'), { origin: '*' })
  await fastify.register(require('@fastify/helmet'), {
    contentSecurityPolicy: {
      directives: {
        baseUri: ['\'self\''],
        defaultSrc: ['\'self\''],
        scriptSrc: ['\'self\''],
        objectSrc: ['\'self\''],
        workerSrc: ['\'self\'', 'blob:'],
        frameSrc: ['\'self\''],
        formAction: ['\'self\''],
        // Swagger UI relies on inline styles and data: URI icons
        styleSrc: ['\'self\'', '\'unsafe-inline\''],
        imgSrc: ['\'self\'', 'data:'],
        upgradeInsecureRequests: []
      }
    }
  })
  await fastify.register(require('@fastify/rate-limit'), {
    max: 100,
    timeWindow: '1 minute'
  })
  await fastify.register(require('@fastify/swagger'), {
    openapi: {
      info: {
        title: name,
        version
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
          }
        }
      }
    }
  })
  await fastify.register(require('@fastify/swagger-ui'), { routePrefix: '/docs' })
  await fastify.register(require('./plugins/db'))
  await fastify.register(require('./plugins/auth'))
  await fastify.register(require('./plugins/sentry'))
  await fastify.register(require('./routes'), { prefix: 'api/v1' })

  fastify.get('/health', async (request, reply) => {
    const dbConnected = fastify.mongo.connection.readyState === 1

    reply.code(dbConnected ? 200 : 503).send({
      status: dbConnected ? 'ok' : 'unavailable',
      database: dbConnected ? 'up' : 'down'
    })
  })

  fastify.setNotFoundHandler((request, reply) => {
    fastify.log.debug(`Route not found: ${request.method}:${request.raw.url}`)

    reply.status(404).send({
      statusCode: 404,
      error: NOT_FOUND,
      message: `Route ${request.method}:${request.raw.url} not found`
    })
  })

  fastify.setErrorHandler((err, request, reply) => {
    fastify.log.error(err)

    // MongoDB unique index violation (e.g. duplicated email in a race)
    if (err.code === 11000) {
      return reply.status(409).send({
        statusCode: 409,
        error: 'Conflict',
        message: 'Duplicated value for a unique field.'
      })
    }

    // mongoose validation/cast errors indicate an invalid request
    const isClientDataError = ['ValidationError', 'CastError'].includes(err.name)
    const statusCode = isClientDataError ? 400 : err.statusCode ?? 500

    // internal 5xx details are only exposed in development
    const exposeMessage = statusCode < 500 || fromEnv('NODE_ENV') === 'development'

    reply.status(statusCode).send({
      statusCode,
      error: statusCode >= 500 ? INTERNAL_SERVER_ERROR : err.name,
      message: exposeMessage ? err.message : 'Something went wrong.'
    })
  })

  return fastify
}

// implement inversion of control to make the code testable
module.exports = {
  build
}
