const { WebhookClient } = require('dialogflow-fulfillment');
const admin = require('firebase-admin');
const express = require('express');
const sgMail = require('@sendgrid/mail');
const app = express();

require('dotenv').config()

sgMail.setApiKey(process.env.SENDGRID_KEY);

// initialise DB connection
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: process.env.FIREBASE_URL
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
      agent.add(`Thanks ${name}, what is your adress?`);

      return admin
        .database()
        .ref('users/' + userId)
        .set({
          name: name
        })
    } else {
      agent.add(`Oops something went wrong... Please try again.`);
    }
  }


  function handleAdress(agent) {
    const adress = agent.parameters.adress;
    const userId = 1;

    if (adress) {
      agent.add(`Thanks, are you buying or renting?`);

      return admin
        .database()
        .ref('users/' + userId)
        .update({
          adress: adress
        })
    } else {
      agent.add(`Oops something went wrong... Please try again.`);
    }
  }

  function handleBuyOrRent(agent) {
    const buying = agent.parameters.buying;
    const userId = 1;

    if (buying) {
      agent.add(`Thanks, do you need a parking permit?`);

      return admin
        .database()
        .ref('users/' + userId)
        .update({
          buyingOrRenting: buying
        })
    } else {
      agent.add(`Oops something went wrong... Please try again.`);
    }
  }

  function handlePermit(agent) {
    const permit = agent.parameters.permit;
    const userId = 1;

    if (permit) {
      agent.add(`Thanks, are you sure about all the data?`);

      return admin
        .database()
        .ref('users/' + userId)
        .update({
          permit: permit
        })
    } else {
      agent.add(`Oops something went wrong... Please try again.`);
    }
  }


  function handleConfirmation(agent) {
    const confirm = agent.parameters.confirm;

    if (confirm) {
      agent.add('Confirmed! Further instructions in your email')
      const db = admin.database();
      const ref = db.ref("users");

      return ref.on('value', function (snapshot) {
        const data = snapshot.val();
        const { name, buyingOrRenting, adress, permit } = data[1];

        const msg = {
          to: 'marvin.holleman@hotmail.nl',
          from: 'bevestiging@voix.com',
          subject: 'Afspraak bevestiging',
          html: `<h1>Thank you for your Request!</h1>
            <h3>Please take this email to your appointment at the district office</h3> <br/>
                   Your Name: ${name} <br/> 
                   type of request: Relocation <br/>
                   Your new adress: ${adress} <br/>
                   Buying or renting: ${buyingOrRenting}<br/>
                   Parking permit: ${permit}`
        }

        sgMail.send(msg);
      });
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
  intentMap.set('Relocate-yes-askname-askAdress-buy-or-rent-parking-confirm', handleConfirmation);
  // intentMap.set('confirm', confirmRequest);

  agent.handleRequest(intentMap);
});

module.exports = app;
