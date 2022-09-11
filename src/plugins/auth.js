const { fromEnv } = require('../utils')
const fastifyPlugin = require('fastify-plugin')

module.exports = fastifyPlugin(async function (fastify, opts) {
  fastify.register(require('@fastify/jwt'), {
    secret: fromEnv('JWT_SECRET'),
    messages: {
      badRequestErrorMessage: 'Format is Authorization: Bearer [token]',
      noAuthorizationInHeaderMessage: 'Autorization header is missing!',
      authorizationTokenExpiredMessage: 'Authorization token expired',
      authorizationTokenInvalid: (err) => {
        return `Authorization token is invalid: ${err.message}`
      }
    }
  })

  fastify.decorate('authenticate', async function (request, reply) {
    try {
      await request.jwtVerify()
    } catch (err) {
      reply.send(err)
    }
  })
})
