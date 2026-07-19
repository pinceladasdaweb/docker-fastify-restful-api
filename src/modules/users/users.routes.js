const controller = require('./users.controller')
const { createSchema, authSchema } = require('./users.schemas')
const validatorCompiler = require('../../shared/validators/ajv')

// login and register get a stricter limit to slow down brute-force attempts
const strictRateLimit = {
  rateLimit: {
    max: 5,
    timeWindow: '1 minute'
  }
}

const userRoutes = async (app, options) => {
  app.post('/auth', { schema: authSchema, validatorCompiler, config: strictRateLimit }, controller.auth)
  app.post('/register', { schema: createSchema, validatorCompiler, config: strictRateLimit }, controller.register)
}

module.exports = userRoutes
