const apiRoutes = async (app, options) => {
  app.register(require('./users'), { prefix: 'users' })
  app.register(require('./movies'), { prefix: 'movies' })
  app.get('/', async (request, reply) => {
    return {
      message: 'Fastify API is on fire'
    }
  })
}

module.exports = apiRoutes
