const { createSchema } = require('./schemas')
const { moviesController } = require('../../../controllers')

const moviesRoutes = async (app, options) => {
  app.post('/', { schema: createSchema }, moviesController.create)
}

module.exports = moviesRoutes
