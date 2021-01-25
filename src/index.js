const { app: server } = require('./app')
const { APP_PORT } = require('./environment')

server()
  .then(app => {
    app.listen(APP_PORT, '0.0.0.0')
      .then(_ => {
        process.on('SIGINT', () => {
          app.mongo.connection.close()
          app.close()
          process.exit(0)
        })
          .on('SIGTERM', () => {
            app.mongo.connection.close()
            app.close()
            process.exit(0)
          })
      })
      .catch(err => {
        console.log('Error starting server: ', err)
        process.exit(1)
      })
  })
  .catch(err => console.log(err))
