const pino = require('pino')

const logger = pino({
  prettyPrint: {
    colorize: true,
    levelFirst: true,
    ignore: 'time,pid,hostname'
  },
  prettifier: require('pino-pretty')
})

module.exports = logger
