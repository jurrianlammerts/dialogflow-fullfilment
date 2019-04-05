const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
const express = require('express');
const { WebhookClient } = require('dialogflow-fulfillment');
const app = express();

// initialise DB connection
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://voix-233614.firebaseio.com'
});

app.get('/', (req, res) => res.send('online'));
app.post('/dialogflow', express.json(), (req, res) => {
  const agent = new WebhookClient({ request: req, response: res });

  function handleName(agent) {
    const name = agent.parameters.name;
    const userId = 1;

    if (name) {
      agent.add(`Thank you ${name}!`);

      return admin
        .database()
        .ref('/users/' + userId)
        .set({
          name: name
        })
        .then(snapshot => {
          // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
          console.log('database write succesfull: ' + snapshot.ref.toString());
        });
    } else {
      agent.add(`Oops something went wrong... Please try again.`);
    }
  }

  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set('AskName', handleName);
  agent.handleRequest(intentMap);
});

module.exports = app;
