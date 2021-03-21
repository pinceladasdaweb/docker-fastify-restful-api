const env = process.env
const dotenv = require('dotenv')
const { deepFreeze } = require('../utils')

dotenv.config()

const enviroment = deepFreeze({
  /* GENERAL */
  NODE_ENV: env.NODE_ENV,
  APP_PORT: env.APP_PORT,
  SALT: env.SALT,
  JWT_SECRET: env.JWT_SECRET,
  /* DATABASE */
  MONGODB_HOST: env.MONGODB_HOST,
  MONGODB_USERNAME: env.MONGODB_USERNAME,
  MONGODB_PASSWORD: env.MONGODB_PASSWORD,
  MONGODB_DATABASE: env.MONGODB_DATABASE,
  /* MONITORING */
  SENTRY_DSN: env.SENTRY_DSN
})

module.exports = enviroment
