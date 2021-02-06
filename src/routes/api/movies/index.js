const { moviesController } = require('../../../controllers')

const moviesRoutes = async (app, options) => {
  app.post('/', moviesController.create)
}

module.exports = moviesRoutes
