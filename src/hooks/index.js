const Sentry = require('@sentry/node')
const { NODE_ENV } = require('../environment')
const fastifyPlugin = require('fastify-plugin')

module.exports = fastifyPlugin((fastify, options, next) => {
  fastify.addHook('onError', (request, reply, error, done) => {
    if (NODE_ENV !== 'development') {
      Sentry.withScope(scope => {
        scope.setTag('path', request.raw.url)
        Sentry.captureException(error)
      })
    }

    done()
  })

  next()
})
