const { createSchema, listSchema } = require('./schemas')
const { moviesController } = require('../../../controllers')

const moviesRoutes = async (app, options) => {
  app.get('/', { schema: listSchema }, moviesController.list)
  app.post('/', { schema: createSchema }, moviesController.create)
}

module.exports = moviesRoutes
