const pino = require('pino')
const fromEnv = require('./fromenv')

const logger = pino({
  level: fromEnv('LOG_LEVEL'),
  formatters: {
    level: (level) => ({ level })
  },
  timestamp: () => `,"time":"${new Date(Date.now()).toISOString()}"`,
  ...(fromEnv('NODE_ENV') === 'development' && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        levelFirst: true,
        ignore: 'time,pid,hostname'
      }
    }
  })
})

module.exports = logger
