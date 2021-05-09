const fastifyPlugin = require('fastify-plugin')
const { JWT_SECRET } = require('../environment')

module.exports = fastifyPlugin(async function(fastify, opts) {
  fastify.register(require('fastify-jwt'), {
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

  fastify.decorate('authenticate', async function(request, reply) {
    try {
      await request.jwtVerify()
    } catch (err) {
      reply.send(err)
    }
  })
})
