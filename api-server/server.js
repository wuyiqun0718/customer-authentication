require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const config = require('../src/config');

const app = express();
const customDatastore = require("./customDatastore");
const customerDB =  new customDatastore(__dirname + '/customer.db');
const certificateDB = new customDatastore(__dirname + '/certificate.db');

const customers = require("./customers")(customerDB, certificateDB);
const certificates = require("./certificates")(customerDB, certificateDB);

const outputError = (error, res) => {
    console.error(error);
    res.sendStatus(500);
}

app.use(express.static(path.join(__dirname, '../build'))) ;
app.use(cors());

app.get('/customers', (req, res) => {
    customers.getAll()
        .then(data => res.send(data))
        .catch(error => outputError(error, res))
});

app.post('/customers', bodyParser.json(), (req, res) => {
    customers.add(req.body)
        .then(data => res.send(data))
        .catch(error => outputError(error, res))
})

app.delete('/customers/:id', (req, res) => {
    customers.delete(req.params.id)
        .then(data => res.send({removed: data}))
        .catch(error => outputError(error, res))
})

app.get('/customers/:customerId', (req, res) => {
    certificates.getAll(req.params.customerId)
        .then(data => res.send(data))
        .catch(error => outputError(error, res))
})

app.post('/certificates', bodyParser.json(), (req, res) => {
    certificates.add(req.body.customerId)
        .then(data => res.send(data))
        .catch(error => outputError(error, res))
})

app.post('/certificates/:id', bodyParser.json(), (req, res) => {
    certificates.changeStatus(req.params.id, req.body.status)
        .then(data => res.send({ updated: data }))
        .catch(error => outputError(error, res))
})

app.listen(config.port, () => {
    console.log('Server listening on port %s, Ctrl+C to stop', config.port)
})
