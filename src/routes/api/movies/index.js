const { moviesController } = require('../../../controllers')
const { createSchema, listSchema, viewSchema, updateSchema } = require('./schemas')

const moviesRoutes = async (app, options) => {
  app.get('/', { schema: listSchema }, moviesController.list)
  app.get('/:id', { schema: viewSchema }, moviesController.view)
  app.post('/', { schema: createSchema }, moviesController.create)
  app.patch('/:id', { schema: updateSchema }, moviesController.update)
  app.delete('/:id', moviesController.exclude)
}

module.exports = moviesRoutes
