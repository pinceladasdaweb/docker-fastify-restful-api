const Fastify = require('fastify')
const { NODE_ENV } = require('./environment')

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
  await fastify.register(require('fastify-helmet'), { contentSecurityPolicy: false })
  await fastify.register(require('fastify-cors'), { origin: '*' })
  await fastify.register(require('./routes/api'), { prefix: 'api/v1' })
  await fastify.register(require('./hooks'))

  return fastify
}

module.exports = {
  app
}
