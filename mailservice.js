
const admin = require("firebase-admin");

const sgMail = require('@sendgrid/mail');
// const express = require('express')

require('dotenv').config()

// const app = express()

// const serviceAccount = require('./serviceAccountKey.json');

sgMail.setApiKey(process.env.SENDGRID_KEY);
// firebase.initializeApp(config);

// TODO: you only need to call initializeApp() once

// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     databaseURL: 'https://voix-233614.firebaseio.com/'
// });

// app.get('/', (req, res) => res.send('online'))

const confirm = admin => {
    // const db = firebase.app().database().ref('adress');
    const db = admin.database();
    const ref = db.ref("users");
    ref.on('value', function (snapshot) {
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
        };
        sgMail.send(msg);
    });
}

module.exports = confirm;