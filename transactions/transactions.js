var Web3 = require("web3");
var twilio = require('twilio');
require('dotenv').config()

var web3 = new Web3(
    new Web3.providers.HttpProvider(
      process.env.ETHEREUM_TEST_NETWORK_URL
    )
  );

var twilioClient = new twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

var currentBalance = -1;
var currentTxId = '';
var currentTx = '';

const composeTransaction = (body) => {
  var split = body.split('|');
  if (split && split.length == 2) {
    // the prefix is the Tx ID
    if (split[0] === currentTxId) {
      // means we have already started processing this message
      currentTx += split[1];

      // the transaction should be complete so we can send it
      forwardTransaction('0x' + currentTx);

      currentTx = '';
      currentTxId = '';
    }
    else {
      // means this is the beginning of a new transaction
      currentTxId = split[0];
      currentTx = split[1];
    }
  }
}

const forwardTransaction = (tx) => {
  var message = '';

  web3.eth
  .sendSignedTransaction(tx, function(err, resp) {
    if (err) {
      console.log('error', err)
      message = 'Something went wrong while sending your transaction. Try again.'
    }
    else {
      console.log("signed transaction sent", resp)
      message = 'Transaction sent! Your $$$ is moving!';
    }
  })
}

const sendTwiMLResponse = (message, res) => {
    var twiml = new twilio.twiml.MessagingResponse();
    twiml.message(message);
    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(twiml.toString());
}


const pollBalance = async () => web3.eth
.getBalance("0x6b98b6D48B746F8a311249d949C7dc1A6Db51A77") //violeta's rinkeby address
.then(balance => {
    console.log("polling")
    if (balance != currentBalance) {
        
        if (currentBalance >= 0) {
          var balanceInEthers = web3.fromWei(currentBalance, 'ether')
          // there's a change in balance, we need to notify the twilio app
          console.log("balance has changed")
          //var message = `Your new balance is ${currentBalance}. ${balance > currentBalance ? 'Your funds are growing. Good on you.' : '$$$ flying away. Watch your pocket!'}`
          var message = `BALANCE|${balanceInEthers}`
          sendTextMessage(message);
        }

        currentBalance = balance;
    }
})

const sendTextMessage = (body) => {
    twilioClient.messages.create({
        body: body,
        //to: '+31612805730',  // violeta leaseplan number
        to: '+31682796310', // kasper's lebara
        from: process.env.TWILIO_PHONENUMBER 
    })
    .then((response) => console.log(response.sid));
}

module.exports.forwardTransaction = forwardTransaction;
module.exports.pollBalance = pollBalance;
module.exports.composeTransaction = composeTransaction;