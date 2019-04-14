var Web3 = require("web3");
var twilio = require('twilio');
var math = require('mathjs');
require('dotenv').config()

var web3 = new Web3(
    new Web3.providers.HttpProvider(
      process.env.ETHEREUM_TEST_NETWORK_URL
    )
  );

var twilioClient = new twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

var state = {
  lebara1: { //ovidiu
    address: '0x115960decb7aa60f8d53c39cc65e30c860a2e171', //kasper's address
    number: '+31622167828',
    currentBalance: -1,
  },
  lebara2: { //kasper
    address: '0xacad7f7dad2d7490260007b388c48a45b31cf552', //another kasper's address
    number: '+31682796310',
    currentBalance: -1,
  }
}

var currentTxId = '';
var currentTx1 = '';
var currentTx2 = '';

const composeTransaction = (body) => {
  var split = body.split('|');
  if (split && split.length == 3) {
    // the prefix is the Tx ID
    if (split[1] === currentTxId) {
      
      // means we have already started processing this message
      //currentTx += split[1];
      setTx(split)

      console.log("second part of tx", body, currentTx1, currentTx2, currentTxId)

      if (currentTx1.length > 0 && currentTx2.length > 0) {
        var currentTx = currentTx1 + currentTx2;

        forwardTransaction(currentTx);
        console.log("currentTx", currentTx)

        currentTx1 = '';
        currentTx2 = '';
        currentTxId = '';
      }
    }
    else {
      // means this is the beginning of a new transaction
      currentTxId = split[1];
      
      setTx(split)

      console.log("first part of tx", body, currentTx1, currentTx2, currentTxId)
    }
  }
}

const setTx = (split) => {
  if (split[0] === '1') {
    currentTx1 = split[2]
  }
  else if (split[0] === '2') {
    currentTx2 = split[2]
  }
}

const forwardTransaction = (tx) => {
  var message = '';

  var result = web3.eth.sendSignedTransaction(tx)
  result.on('receipt', console.log)
  result.on('error', console.log)
}

const sendTwiMLResponse = (message, res) => {
    var twiml = new twilio.twiml.MessagingResponse();
    twiml.message(message);
    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(twiml.toString());
}

const pollBalance = function(simName) {
  return function() {
    var stateData = state[simName];
    web3.eth
    //.getBalance("0x6b98b6D48B746F8a311249d949C7dc1A6Db51A77") //violeta's rinkeby address
    .getBalance(stateData.address)
    .then(balance => {
        console.log("polling " + simName)
        var balanceInEthers = math.divide(stateData.currentBalance, 1000000000000);
        if (balance != stateData.currentBalance) {
            
            if (stateData.currentBalance >= 0) {
              var message = `BALANCE|${balanceInEthers}`
              console.log("BALANCE", message)
              sendTextMessage(message, simName);
            }

            stateData.currentBalance = balance;
        }
    })
  }
}

const sendTextMessage = (body, simName) => {
  var stateData = state[simName];
  console.log("statedata", stateData);
    twilioClient.messages.create({
        body: body,
        //to: '+31612805730',  // violeta leaseplan number
        //to: '+31682796310', // kasper's lebara
        to: stateData.number,
        from: process.env.TWILIO_PHONENUMBER 
    })
    .then((response) => console.log(response.sid));
}

module.exports.forwardTransaction = forwardTransaction;
module.exports.pollBalance = pollBalance;
module.exports.composeTransaction = composeTransaction;
module.exports.state = state;