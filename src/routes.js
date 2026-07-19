const routes = async (app, options) => {
  app.register(require('./modules/users/users.routes'), { prefix: 'users' })
  app.register(require('./modules/movies/movies.routes'), { prefix: 'movies' })

  app.get('/', async (request, reply) => {
    return {
      message: 'Fastify API is on fire'
    }
  })
}

module.exports = routes
