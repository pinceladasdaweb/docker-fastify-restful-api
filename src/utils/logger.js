const pino = require('pino')
const fromEnv = require('./fromenv')

const logger = pino({
  level: fromEnv('LOG_LEVEL'),
  prettyPrint: {
    colorize: true,
    levelFirst: true,
    ignore: 'time,pid,hostname'
  }
})

module.exports = logger
