'use strict';

const express = require('express');
const cors = require('cors');

const PORT = 8080;
const HOST = '0.0.0.0';
const app = express();

// Cors for frontend ip != backend ip
app.use(cors())

app.get('/', (req, res) => {
  res.send('Hello World 2');
});


app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
