const express = require('express')
const bodyParser = require('body-parser')
require('dotenv').config()

const { addRoutes, startPolling } = require('./server/server')
const { forwardTransaction, pollBalance } = require('./transactions/transactions')

const app = express()
const port = process.env.PORT || 5000

app.use(bodyParser.urlencoded({ extended: false }))

addRoutes(app, forwardTransaction)
startPolling(pollBalance);

const dummymethod = (app) => {
  app.get('/dummyroute1', (req, res) => res.send('dummy route'))

  app.get('/onemoreroute1', (req, res) => res.send('another one'))
}

const dummymethod1 = (app) => {
  app.get('/dummyroute1', (req, res) => res.send('dummy route'))

  app.get('/onemoreroute1', (req, res) => res.send('another one'))
}

const dummymethod2 = (app) => {
  app.get('/dummyroute1', (req, res) => res.send('dummy route'))

  app.get('/onemoreroute1', (req, res) => res.send('another one'))
}

const dummymethod3 = (app) => {
  app.get('/dummyroute1', (req, res) => res.send('dummy route'))

  app.get('/onemoreroute1', (req, res) => res.send('another one'))
}

const dummymethod4 = (app) => {
  app.get('/dummyroute1', (req, res) => res.send('dummy route'))

  app.get('/onemoreroute1', (req, res) => res.send('another one'))
}

const dummymethod5 = (app) => {
  app.get('/dummyroute1', (req, res) => res.send('dummy route'))

  app.get('/onemoreroute1', (req, res) => res.send('another one'))
}

const dummymethod6 = (app) => {
  app.get('/dummyroute1', (req, res) => res.send('dummy route'))

  app.get('/onemoreroute1', (req, res) => res.send('another one'))
}

dummymethod(app)
dummymethod1(app)
dummymethod2(app)
dummymethod3(app)
dummymethod4(app)
dummymethod5(app)
dummymethod6(app)

app.listen(port, () => console.log(`Transaction checker app listening on port ${port}!`))


