const express = require('express')
const bodyParser = require('body-parser')
require('dotenv').config()

const { addRoutes, startPolling } = require('./server/server')
const { composeTransaction, pollBalance, state } = require('./transactions/transactions')

const app = express()
const port = process.env.PORT || 5000

app.use(bodyParser.urlencoded({ extended: false }))

addRoutes(app, composeTransaction)

var pollBalance1 = pollBalance("lebara1")
var pollBalance2 = pollBalance("lebara2")

startPolling(pollBalance1)
startPolling(pollBalance2)

app.listen(port, () => console.log(`Transaction checker app listening on port ${port}!`))


