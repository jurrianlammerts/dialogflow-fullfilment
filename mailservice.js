
const firebase = require('firebase');

const sgMail = require('@sendgrid/mail');
const express = require('express')

const app = express()

const serviceAccount = require('./serviceAccountKey.json');


const config = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    databaseURL: process.env.DB_URL,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID
}
console.log(process.env.DB_URL)
sgMail.setApiKey(process.env.SENDGRID_KEY);
// firebase.initializeApp(config);

// TODO: you only need to call initializeApp() once

// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     databaseURL: 'https://voix-233614.firebaseio.com/'
// });

app.get('/', (req, res) => res.send('online'))

function confirm() {
    // const db = firebase.app().database().ref('adress');
    const db = admin.database();
    const ref = db.ref("users");
    ref.on('value', function (snapshot) {
        snapshot.forEach(function (doc) {
            let items = doc.val();
            console.log('keys', items);
            const msg = {
                to: 'marvin.holleman@hotmail.nl',
                from: 'bevestiging@voix.com',
                subject: 'Afspraak bevestiging',
                html: `Je naam: ${items.name} <br/> 
                   Geboortedatum: ${items.buying} <br/>
                   Woonplaats: ${items.permit}`,
            };
            sgMail.send(msg);
        })

    });
}

confirm();
module.exports = app;