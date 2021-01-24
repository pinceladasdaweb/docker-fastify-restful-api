const env = process.env
const dotenv = require('dotenv')

dotenv.config()

const enviroment = Object.freeze({
  /* GENERAL */
  NODE_ENV: env.NODE_ENV,
  APP_PORT: env.APP_PORT,
  /* DATABASE */
  MONGODB_HOST: env.MONGODB_HOST,
  MONGODB_USERNAME: env.MONGODB_USERNAME,
  MONGODB_PASSWORD: env.MONGODB_PASSWORD,
  MONGODB_DATABASE: env.MONGODB_DATABASE
})

module.exports = enviroment
