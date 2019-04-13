const express = require('express')
const bodyParser = require('body-parser')
require('dotenv').config()

const { addRoutes, startPolling } = require('./server/server')
const { forwardTransaction, pollBalance } = require('./transactions/transactions')

const app = express()
const port = process.env.PORT || 5000

var description = 'Transaction checker \r\n POST /forward-transaction \r\n Send a raw transaction to this url and it will be forwarded to the network';
app.get('/', (req, res) => res.send(description))

app.use(bodyParser.urlencoded({ extended: false }))

addRoutes(app, forwardTransaction);
startPolling(pollBalance);

app.listen(port, () => console.log(`Transaction checker app listening on port ${port}!`))


