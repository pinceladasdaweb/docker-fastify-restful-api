const { createSchema, authSchema } = require('./schemas')
const { usersController } = require('../../../controllers')

const userRoutes = async (app, options) => {
  app.post('/auth', { schema: authSchema }, usersController.auth)
  app.post('/register', { schema: createSchema }, usersController.register)
}

module.exports = userRoutes
