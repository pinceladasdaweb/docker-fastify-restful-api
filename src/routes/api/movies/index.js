const { moviesController } = require('../../../controllers')
const { createSchema, listSchema, viewSchema, updateSchema } = require('./schemas')

const moviesRoutes = async (app, options) => {
  app.get('/', { schema: listSchema, preValidation: [app.authenticate] }, moviesController.list)
  app.get('/:id', { schema: viewSchema, preValidation: [app.authenticate] }, moviesController.view)
  app.post('/', { schema: createSchema, preValidation: [app.authenticate] }, moviesController.create)
  app.patch('/:id', { schema: updateSchema, preValidation: [app.authenticate] }, moviesController.update)
  app.delete('/:id', { preValidation: [app.authenticate] }, moviesController.exclude)
}

module.exports = moviesRoutes
