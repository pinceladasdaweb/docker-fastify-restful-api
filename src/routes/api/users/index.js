const { createSchema } = require('./schemas')
const { userController } = require('../../../controllers')

const userRoutes = async (app, options) => {
  app.post('/', { schema: createSchema }, userController.register)
}

module.exports = userRoutes
