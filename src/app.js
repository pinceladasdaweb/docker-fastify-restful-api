const Fastify = require('fastify')
const { LOG_LEVEL, NODE_ENV } = require('./environment')

const logger = {
  development: {
    prettyPrint: {
      colorize: true,
      levelFirst: true,
      ignore: 'time,pid,hostname'
    },
    level: LOG_LEVEL
  },
  production: {
    formatters: {
      level (level) {
        return { level }
      }
    },
    timestamp: () => `,"time":"${new Date(Date.now()).toISOString()}"`,
    level: LOG_LEVEL
  }
}

const app = async () => {
  const fastify = Fastify({
    ajv: {
      customOptions: {
        allErrors: true,
        jsonPointers: true,
        $data: true
      },
      plugins: [
        require('ajv-errors'),
        require('ajv-keywords')
      ]
    },
    bodyLimit: 1048576 * 2,
    logger: logger[NODE_ENV]
  })

  await fastify.register(require('./plugins/db'))
  await fastify.register(require('./plugins/auth'))
  await fastify.register(require('./plugins/sentry'))
  await fastify.register(require('fastify-helmet'), {
    contentSecurityPolicy: {
      directives: {
        baseUri: ['\'self\''],
        defaultSrc: ['\'self\''],
        scriptSrc: ['\'self\''],
        objectSrc: ['\'self\''],
        workerSrc: ['\'self\'', 'blob:'],
        frameSrc: ['\'self\''],
        formAction: ['\'self\''],
        upgradeInsecureRequests: []
      }
    }
  })
  await fastify.register(require('fastify-cors'), { origin: '*' })
  await fastify.register(require('./routes/api'), { prefix: 'api/v1' })
  await fastify.register(require('./hooks'))

  fastify.setNotFoundHandler((request, reply) => {
    fastify.log.debug(`Route not found: ${request.method}:${request.raw.url}`)

    reply.status(404).send({
      statusCode: 404,
      error: 'Not Found',
      message: `Route ${request.method}:${request.raw.url} not found`
    })
  })

  fastify.setErrorHandler((err, request, reply) => {
    fastify.log.debug(`Request url: ${request.raw.url}`)
    fastify.log.debug(`Payload: ${request.body}`)
    fastify.log.error(`Error occurred: ${err}`)

    const code = err.statusCode ?? 500

    reply.status(code).send({
      statusCode: code,
      error: err.name ?? 'Internal server error',
      message: err.message ?? err
    })
  })

  return fastify
}

module.exports = {
  app
}
