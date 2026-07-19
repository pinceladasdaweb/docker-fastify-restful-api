const { build } = require('./app')
const { fromEnv, terminate } = require('./shared/utils')

const start = async () => {
  const app = await build()

  const exitHandler = terminate(app, {
    coredump: false,
    timeout: 10000
  })

  process.on('uncaughtException', exitHandler(1, 'Unexpected Error'))
  process.on('unhandledRejection', exitHandler(1, 'Unhandled Promise'))
  process.on('SIGTERM', exitHandler(0, 'SIGTERM'))
  process.on('SIGINT', exitHandler(0, 'SIGINT'))

  await app.listen({ port: fromEnv('APP_PORT'), host: '0.0.0.0' })
}

start().catch(err => {
  console.error('Error starting server: ', err)
  process.exit(1)
})
