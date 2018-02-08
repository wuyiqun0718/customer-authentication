require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config');

const app = express();

app.listen(config.port, () => {
    console.log('Server listening on port %s, Ctrl+C to stop', config.port)
})
