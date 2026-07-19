const Sentry = require('@sentry/node')
const { fromEnv } = require('../shared/utils')
const fastifyPlugin = require('fastify-plugin')
const { name, version } = require('../../package.json')

module.exports = fastifyPlugin(async (fastify) => {
  const DSN = fromEnv('SENTRY_DSN')

  Sentry.init({
    dsn: DSN,
    environment: fromEnv('NODE_ENV'),
    release: `${name}@${version}`,
    enabled: !!DSN
  })

  if (DSN) {
    Sentry.setupFastifyErrorHandler(fastify)
    fastify.log.info('Sentry is loaded')
  }
})
