const express = require('express')
const bodyParser = require('body-parser')
require('dotenv').config()

const { addRoutes, startPolling } = require('./server/server')
const { composeTransaction, pollBalance } = require('./transactions/transactions')

const app = express()
const port = process.env.PORT || 5000

app.use(bodyParser.urlencoded({ extended: false }))

addRoutes(app, composeTransaction)
startPolling(pollBalance);

app.listen(port, () => console.log(`Transaction checker app listening on port ${port}!`))


