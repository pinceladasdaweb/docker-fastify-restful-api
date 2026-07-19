const fromEnv = require('../fromenv')

const isDevelopment = fromEnv('NODE_ENV') === 'development'

const config = {
  level: fromEnv('LOG_LEVEL', 'info'),
  formatters: {
    level: (level) => ({ level }),
    ...(!isDevelopment ? { bindings: (bindings) => ({ hostname: bindings.hostname }) } : {})
  },
  timestamp: () => `,"time":"${new Date(Date.now()).toISOString()}"`,
  ...(isDevelopment && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        levelFirst: true,
        ignore: 'time,pid,hostname'
      }
    }
  })
}

module.exports = config
