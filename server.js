'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/ping', function(req, res) {
	return res.send("PONG");
});

app.get('/webhook', (req, res) => {
    let VERIFY_TOKEN = "sanu_kumar_gupta"
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];
    if (mode && token) {
      if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        console.log('WEBHOOK_VERIFIED');
        res.status(200).send(challenge);
      
      } else {
        res.sendStatus(403);      
      }
    }
  });

app.post('/webhook', (req, res) => {  
 
    let body = req.body;
    if (body.object === 'page') {
      body.entry.forEach(function(entry) {
         // Gets the body of the webhook event
        let webhook_event = entry.messaging[0];
        console.log(webhook_event);

        // Get the sender PSID
        let sender_psid = webhook_event.sender.id;
        console.log('Sender PSID: ' + sender_psid);

        // Check if the event is a message or postback and
        // pass the event to the appropriate handler function
        if (webhook_event.message) {
            handleMessage(sender_psid, webhook_event.message);        
        } else if (webhook_event.postback) {
            handlePostback(sender_psid, webhook_event.postback);
        }
      });
      res.status(200).send('EVENT_RECEIVED');
    } else {
      res.sendStatus(404);
    }
  
  });

  app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });

  
  // Handles messages events
function handleMessage(sender_psid, received_message) {

    let response;
    // Check if the message contains text
    if (received_message.text) {    
    // Create the payload for a basic text message
        response = {
        "text": `You sent the message: "${received_message.text}". Now send me an image!`
        }
    }  
    // Sends the response message
    callSendAPI(sender_psid, response); 

}

// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {

}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
  // Construct the message body
  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "message": response
  }

  // Send the HTTP request to the Messenger Platform
  request({
    "uri": "https://graph.facebook.com/v2.6/me/messages",
    "qs": { "access_token": "EAAgZCTNwxQOMBAKwEOZAZAX4ma1ZCfN3bf3YbIhqiMLPkakjZBZB4tg83ih67uf1jEGfYCR30nme4xVevgDctwTglV0OgAPt59bDAkzXoYb62vRvTIF2lPwjGWt9YQnLSGts3zwdeLZCrU0O5OnopEJz7NlcUaZCWu10wiLS7MGDg8zt2fN41aPu" },
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if (!err) {
      console.log('message sent!')
    } else {
      console.error("Unable to send message:" + err);
    }
  });
}