var Web3 = require("web3");
var twilio = require('twilio');
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
        if (balance != stateData.currentBalance) {
            
            if (stateData.currentBalance >= 0) {
              var balanceInEthers = web3.fromWei(currentBalance, 'ether')
              // there's a change in balance, we need to notify the twilio app
              console.log("balance has changed")
              //var message = `Your new balance is ${currentBalance}. ${balance > currentBalance ? 'Your funds are growing. Good on you.' : '$$$ flying away. Watch your pocket!'}`
              var message = `BALANCE|${balanceInEthers}`
              sendTextMessage(message);
            }

            stateData.currentBalance = balance;
        }
    })
  }
}

// const pollBalance = async (simName) => {
//   () => {
//     var stateData = state[simName];
//     web3.eth
//     //.getBalance("0x6b98b6D48B746F8a311249d949C7dc1A6Db51A77") //violeta's rinkeby address
//     .getBalance(stateData.address)
//     .then(balance => {
//         console.log("polling " + simName)
//         if (balance != stateData.currentBalance) {
            
//             if (stateData.currentBalance >= 0) {
//               var balanceInEthers = web3.fromWei(currentBalance, 'ether')
//               // there's a change in balance, we need to notify the twilio app
//               console.log("balance has changed")
//               //var message = `Your new balance is ${currentBalance}. ${balance > currentBalance ? 'Your funds are growing. Good on you.' : '$$$ flying away. Watch your pocket!'}`
//               var message = `BALANCE|${balanceInEthers}`
//               sendTextMessage(message);
//             }

//             stateData.currentBalance = balance;
//         }
//     })
//   }
// }

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
module.exports.state = state;