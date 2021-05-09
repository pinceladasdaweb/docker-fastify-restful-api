const Sentry = require('@sentry/node')
const fastifyPlugin = require('fastify-plugin')
const { name, version } = require('../../package.json')
const { NODE_ENV, SENTRY_DSN } = require('../environment')

module.exports = fastifyPlugin((fastify, options, next) => {
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: NODE_ENV,
    release: `${name}@${version}`,
    enabled: !!SENTRY_DSN
  })

  fastify.log.info('Sentry is loaded')

  next()
})
