const { WebhookClient } = require('dialogflow-fulfillment');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
const express = require('express');
const app = express();
// const mailService = require('./mailservice.js');

// initialise DB connection
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://voix-233614.firebaseio.com'
});

app.get('/', (req, res) => res.send('online'));
app.post('/dialogflow', express.json(), (req, res) => {
  const agent = new WebhookClient({ request: req, response: res });

  function saveData(agent) {
    const name = agent.parameters.name;
    const address = agent.parameters.address;
    const userId = 1;

    return admin
      .database()
      .ref('users/' + userId)
      .set({
        name: name,
        address: address,
        type: 'passport'
      });
  }

  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();

  // request passport
  intentMap.set('AskForData', saveData);
  agent.handleRequest(intentMap);
});

module.exports = app;
