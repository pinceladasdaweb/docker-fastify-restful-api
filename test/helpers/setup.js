const { MongoMemoryServer } = require('mongodb-memory-server')

// spins up an in-memory MongoDB and builds the app pointing at it;
// env vars must be set BEFORE the app is required
const setupTestApp = async () => {
  const mongod = await MongoMemoryServer.create()
  const uri = new URL(mongod.getUri())

  process.env.NODE_ENV = 'test'
  process.env.LOG_LEVEL = 'silent'
  process.env.JWT_SECRET = 'test-secret'
  process.env.SALT = '4'
  process.env.MONGODB_HOST = uri.host
  process.env.MONGODB_DATABASE = 'test'
  delete process.env.MONGODB_USERNAME
  delete process.env.MONGODB_PASSWORD
  delete process.env.MONGODB_SRV

  const { build } = require('../../src/app')
  const app = await build()

  return {
    app,
    stop: async () => {
      await app.close()
      await mongod.stop()
    }
  }
}

module.exports = setupTestApp
