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


const forwardTransaction = (tx, res) => {
  var response = '';

  web3.eth
  .sendSignedTransaction(req.body.Body, function(err, resp) {
    if (err) {
      console.log('error', err)
      response = 'Something went wrong while sending your transaction. Try again.'
    }
    else {
      console.log("signed transaction sent", resp)
      response = 'Transaction sent! Your $$$ is moving!';
    }

    var twiml = new twilio.twiml.MessagingResponse();
    twiml.message(response);
    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(twiml.toString());
  })
}


const pollBalance = async () => web3.eth
.getBalance("0x6b98b6D48B746F8a311249d949C7dc1A6Db51A77") //violeta's rinkeby address
.then(balance => {
    console.log("polling")
    if (balance != currentBalance) {
        
        if (currentBalance >= 0) {
          // there's a change in balance, we need to notify the twilio app
          console.log("balance has changed")
          var message = `Your new balance is ${currentBalance}. ${balance > currentBalance ? 'Your funds are growing. Good on you.' : '$$$ flying away. Watch your pocket!'}`
          console.log(message);
          twilioClient.messages.create({
              body: message,
              to: '+31614610317',  
              from: process.env.TWILIO_PHONENUMBER 
          })
          .then((message) => console.log(message.sid));
        }

        currentBalance = balance;
    }
})

module.exports.forwardTransaction = forwardTransaction;
module.exports.pollBalance = pollBalance;