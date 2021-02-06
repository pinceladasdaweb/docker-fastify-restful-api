const { createSchema, authSchema } = require('./schemas')
const { userController } = require('../../../controllers')

const userRoutes = async (app, options) => {
  app.post('/auth', { schema: authSchema }, userController.auth)
  app.post('/register', { schema: createSchema }, userController.register)
}

module.exports = userRoutes
