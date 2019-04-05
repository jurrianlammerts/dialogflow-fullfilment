const express = require('express')
const { WebhookClient } = require('dialogflow-fulfillment')
const dotenv = require('dotenv');
const firebase = require('firebase');
const sgMail = require('@sendgrid/mail');

const app = express()

const config = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DB_URL,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID
}

sgMail.setApiKey(process.env.SENDGRID_KEY);
firebase.initializeApp(config);

app.get('/', (req, res) => res.send('online'))
app.post('/dialogflow', express.json(), (req, res) => {
  const agent = new WebhookClient({ request: req, response: res })

  function welcome() {
    agent.add('Welcome to my agent!')
  }

  function confirm() {
    const db = firebase.firestore();
    db.collection('users').get().then((snapshot) => {
      snapshot.docs.forEach(doc => {
        let items = doc.data();
        console.log(items)

        const msg = {
          to: 'marvin.holleman@hotmail.nl',
          from: 'bevestiging@voix.com',
          subject: 'Afspraak bevestiging',
          html: `Je naam: ${items.person.Naam} <br/> 
           Geboortedatum: ${items.person.Geboortedatum} <br/>
           Woonplaats: ${items.person.Woonplaats}`,
        };
        sgMail.send(msg);
      });
    });
  }

  let intentMap = new Map()
  intentMap.set('Default Welcome Intent', welcome)
  agent.handleRequest(intentMap)
})

module.exports = app
