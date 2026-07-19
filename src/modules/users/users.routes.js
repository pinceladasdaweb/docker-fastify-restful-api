const controller = require('./users.controller')
const { createSchema, authSchema } = require('./users.schemas')
const validatorCompiler = require('../../shared/validators/ajv')

// login e registro têm limite mais rígido para dificultar brute-force
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
