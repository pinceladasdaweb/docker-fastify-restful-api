const pino = require('pino')
const config = require('./config/logger-config')

const logger = pino(config)

module.exports = logger
