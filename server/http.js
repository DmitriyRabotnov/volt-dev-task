const express = require('express')
const bodyParser = require('body-parser')
const http = require('http')
const { green } = require('chalk')

/**  init express server */
const initServer = () => {
  const app = express()
  app.set('port', process.env.PORT || 8000)
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    )
    res.header(
      'Access-Control-Allow-Methods',
      'POST, PUT, GET, OPTIONS, DELETE'
    )

    next()
  })

  return app
}

/** start express server */
const startServer = appWithRoutes => {
  http.createServer(appWithRoutes).listen(appWithRoutes.get('port'), () => {
    console.info(
      green('Express server listening on port ' + appWithRoutes.get('port'))
    )
  })
}

module.exports = { initServer, startServer }
