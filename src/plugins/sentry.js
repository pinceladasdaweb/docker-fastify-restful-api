const Sentry = require('@sentry/node')
const { fromEnv } = require('../utils')
const fastifyPlugin = require('fastify-plugin')
const { name, version } = require('../../package.json')

module.exports = fastifyPlugin((fastify, options, next) => {
  const DSN = fromEnv('SENTRY_DSN')

  Sentry.init({
    dsn: DSN,
    environment: fromEnv('NODE_ENV'),
    release: `${name}@${version}`,
    enabled: !!fromEnv('SENTRY_DSN')
  })

  !!fromEnv('SENTRY_DSN') && fastify.log.info('Sentry is loaded')

  next()
})
