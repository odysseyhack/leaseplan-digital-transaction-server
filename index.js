
const express = require('express')
const { asyncPoll } = require('async-poll')
const bodyParser = require('body-parser')
require('dotenv').config()
const { forwardTransaction, pollBalance } = require('./transactions')

const app = express()
const port = process.env.PORT || 5000

app.use(bodyParser.urlencoded({ extended: false }))

const addRoutes = () => {
  var description = 'Transaction checker \r\n POST /forward-transaction \r\n Send a raw transaction to this url and it will be forwarded to the network';
  app.get('/', (req, res) => res.send(description))
  app.post('/forward-transaction', function(req, res) {
    console.log("forward")
    forwardTransaction(req.body.Body, res)
  });
}

const startPolling = () => {
  const conditionFn = d => false; //keep polling
/** Poll every 5 seconds */
  const interval = 5e3;

  const timeout = 30e9; //find a way to poll forever
  
  asyncPoll(pollBalance, conditionFn, { interval, timeout })
    .then(console.log)
    .catch(console.error);
}


addRoutes();
startPolling();

app.listen(port, () => console.log(`Transaction checker app listening on port ${port}!`))


