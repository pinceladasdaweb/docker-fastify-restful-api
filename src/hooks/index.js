const Sentry = require('@sentry/node')
const { NODE_ENV } = require('../environment')
const fastifyPlugin = require('fastify-plugin')

module.exports = fastifyPlugin((fastify, options, next) => {
  fastify.addHook('onError', (request, reply, error, done) => {
    if (NODE_ENV !== 'development') {
      Sentry.captureException(error)
    }

    done()
  })

  fastify.addHook('onRequest', async (request, reply) => {
    try {
      if (!/\/users.*|\/v1$/.test(request.url)) {
        await request.jwtVerify()
      }
    } catch (err) {
      reply.send(err)
    }
  })

  next()
})
