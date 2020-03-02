const functions = require('firebase-functions');
// We should install required packages (stripe, body-parser) using npm install inside /functions/ folder
const bodyParser = require('body-parser');
const cors = require('cors')({ origin: true });
const express = require('express');
// Secret Key from Stripe Dashboard
const stripe = require('stripe')('sk_live_4aeJGgg577TT6XOuSRvAfOgb00hWAiJzIB');
// The function for sending responses
function send(res, code, body) {
    res.send({
        statusCode: code,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify(body),
    });
}
// Our app has to use express
const createOrderAndSessionApp = express();
// Our app has to use cors
createOrderAndSessionApp.use(cors);
// The function that get data from front-end and create a payment session
function createOrderAndSession(req, res) {
    const body = JSON.parse(req.body);
    // Creating session data from payload
    const currency = body.currency;
    const quantity = body.quantity;
    const amount = body.amount;
    const name = body.name;
    const description = body.description;
    let images = [];
    images[0] = body.image;
    const customerEmail = body.customerEmail;
    const clientId = body.clientId;
    // Also we can process the order data, e.g. save it to firebase database
    // Creating session using the data above
    stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
            name: name,
            description: description,
            images: images,
            amount: amount,
            currency: currency,
            quantity: quantity,
        }],
        client_reference_id: clientId,
        customer_email: customerEmail,
        // We will add the only app page for simplicity
        success_url: 'http://daisymaebbq.com/success?session_id={CHECKOUT_SESSION_ID}',
        cancel_url: 'http://daisymaebbq.com/error',
    }).then(session => {
        // Getting the session id
        var sessionId = session.id;
        // Here we can do something with the session id, e.g. add it to the order data in firebase database
        // Sending the session id to front-end
        send(res, 200, {
            sessionId: sessionId
        });
        return;
    }).catch(error => {
        console.log(error);
        return;
    });
}
// Creating a route
createOrderAndSessionApp.post('/', (req, res) => {
    try {
        createOrderAndSession(req, res);
    } catch (e) {
        send(res, 500, {
            error: `The server received an unexpected error. Please try again and contact the site admin if the error persists.`,
        });
    }
});
// Exporting our http function
exports.createOrderAndSession = functions.https.onRequest(createOrderAndSessionApp);