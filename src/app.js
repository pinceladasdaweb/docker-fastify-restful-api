const Fastify = require('fastify')
const { NODE_ENV, JWT_SECRET } = require('./environment')

const logger = {
  development: {
    prettyPrint: {
      colorize: true,
      levelFirst: true,
      ignore: 'time,pid,hostname'
    }
  },
  production: {
    formatters: {
      level (level) {
        return { level }
      }
    },
    timestamp: () => `,"time":"${new Date(Date.now()).toISOString()}"`
  }
}

const app = async () => {
  const fastify = Fastify({
    bodyLimit: 1048576 * 2,
    logger: logger[NODE_ENV]
  })

  await fastify.register(require('./plugins/db'))
  await fastify.register(require('./plugins/sentry'))
  await fastify.register(require('fastify-jwt'), {
    secret: JWT_SECRET,
    messages: {
      badRequestErrorMessage: 'Format is Authorization: Bearer [token]',
      noAuthorizationInHeaderMessage: 'Autorization header is missing!',
      authorizationTokenExpiredMessage: 'Authorization token expired',
      authorizationTokenInvalid: (err) => {
        return `Authorization token is invalid: ${err.message}`
      }
    }
  })
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

  fastify.setErrorHandler((err, request, reply) => {
    this.log.error(err)
    reply.send(err)
  })

  return fastify
}

module.exports = {
  app
}
