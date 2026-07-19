const controller = require('./users.controller')
const { createSchema, authSchema } = require('./users.schemas')
const validatorCompiler = require('../../shared/validators/ajv')

const userRoutes = async (app, options) => {
  app.post('/auth', { schema: authSchema, validatorCompiler }, controller.auth)
  app.post('/register', { schema: createSchema, validatorCompiler }, controller.register)
}

module.exports = userRoutes
