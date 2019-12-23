'use strict';
const express = require('express');
const bodyParser = require('body-parser');

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
        let webhook_event = entry.messaging[0];
        console.log(webhook_event);
      });
      res.status(200).send('EVENT_RECEIVED');
    } else {
      res.sendStatus(404);
    }
  
  });

  app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });
  