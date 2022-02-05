const { createSchema, authSchema } = require('./schemas')
const { usersController } = require('../../../controllers')
const validatorCompiler = require('../../../validators/ajv')

const userRoutes = async (app, options) => {
  app.post('/auth', { schema: authSchema, validatorCompiler }, usersController.auth)
  app.post('/register', { schema: createSchema, validatorCompiler }, usersController.register)
}

module.exports = userRoutes
