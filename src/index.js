const { app: server } = require('./app')
const { APP_PORT } = require('./environment')

server()
  .then(app => {
    app.listen(APP_PORT, '0.0.0.0')
      .then(_ => {
        process.on('SIGINT', () => app.close())
        process.on('SIGTERM', () => app.close())
      })
      .catch(err => {
        console.log('Error starting server: ', err)
        process.exit(1)
      })
  })
  .catch(err => console.log(err))
