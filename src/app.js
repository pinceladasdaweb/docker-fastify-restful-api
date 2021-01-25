const Fastify = require('fastify')

const app = async () => {
  const fastify = Fastify({
    bodyLimit: 1048576 * 2,
    logger: {
      prettyPrint: {
        colorize: true
      }
    }
  })

  await fastify.register(require('./plugins/db'))
  await fastify.register(require('fastify-helmet'), { contentSecurityPolicy: false })
  await fastify.register(require('fastify-cors'), { origin: '*' })
  await fastify.register(require('./routes/api'), { prefix: 'api/v1' })

  return fastify
}

module.exports = {
  app
}
