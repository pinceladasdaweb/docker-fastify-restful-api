const apiRoutes = async (app, options) => {
  app.get('/', async (request, reply) => {
    return {
      message: 'Fastify API is on fire'
    }
  })
}

module.exports = apiRoutes
