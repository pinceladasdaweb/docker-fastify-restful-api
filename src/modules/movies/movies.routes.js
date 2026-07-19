const controller = require('./movies.controller')
const validatorCompiler = require('../../shared/validators/ajv')
const { createSchema, listSchema, viewSchema, updateSchema, deleteSchema } = require('./movies.schemas')

const moviesRoutes = async (app, options) => {
  app.get('/', { schema: listSchema, validatorCompiler, preValidation: [app.authenticate] }, controller.list)
  app.get('/:id', { schema: viewSchema, validatorCompiler, preValidation: [app.authenticate] }, controller.view)
  app.post('/', { schema: createSchema, validatorCompiler, preValidation: [app.authenticate] }, controller.create)
  app.patch('/:id', { schema: updateSchema, validatorCompiler, preValidation: [app.authenticate] }, controller.update)
  app.delete('/:id', { schema: deleteSchema, validatorCompiler, preValidation: [app.authenticate] }, controller.exclude)
}

module.exports = moviesRoutes
