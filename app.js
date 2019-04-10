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

  function handleName(agent) {
    const name = agent.parameters.name;
    const userId = 1;

    if (name) {
      agent.add(`Thank you ${name}!`);

      return admin
        .database()
        .ref('users/' + userId)
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


  function handleAdress(agent) {
    const adress = agent.parameters.adress;
    const userId = 1;

    if (adress) {
      agent.add(`Thank you ${adress}!`);

      return admin
        .database()
        .ref('users/' + userId)
        .update({
          adress: adress
        })
        .then(snapshot => {
          // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
          console.log('database write succesfull: ' + snapshot.ref.toString());
        });
    } else {
      agent.add(`Oops something went wrong... Please try again.`);
    }
  }

  function handleBuyOrRent(agent) {
    const buying = agent.parameters.buying;
    const userId = 1;

    if (buying) {
      agent.add(`Thank you ${buying}!`);

      return admin
        .database()
        .ref('users/' + userId)
        .update({
          buyingOrRenting: buying
        })
        .then(snapshot => {
          // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
          console.log('database write succesfull: ' + snapshot.ref.toString());
        });
    } else {
      agent.add(`Oops something went wrong... Please try again.`);
    }
  }

  function handlePermit(agent) {
    const permit = agent.parameters.permit;
    const userId = 1;

    if (permit) {
      agent.add(`Thank you ${permit}!`);

      return admin
        .database()
        .ref('users/' + userId)
        .update({
          permit: permit
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

  // request passport
  intentMap.set('AskForData', saveData);

  intentMap.set('Relocate-yes-askname', handleName);
  intentMap.set('Relocate-yes-askname-askAdress', handleAdress);
  intentMap.set('Relocate-yes-askname-askAdress-buy-or-rent', handleBuyOrRent);
  intentMap.set('Relocate-yes-askname-askAdress-buy-or-rent-parking', handlePermit);
  // intentMap.set('confirm', confirmRequest);

  agent.handleRequest(intentMap);
});

module.exports = app;
