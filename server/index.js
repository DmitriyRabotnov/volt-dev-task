const { DBRun } = require('./db')
const { initServer, startServer } = require('./http')

DBRun()
startServer(require('./api')(initServer()))
