const { createSchema } = require('./schemas')
const { userController } = require('../../../controllers')

const userRoutes = async (app, options) => {
  app.post('/auth', userController.auth)
  app.post('/register', { schema: createSchema }, userController.register)
}

module.exports = userRoutes
