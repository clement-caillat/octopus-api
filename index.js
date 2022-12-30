const express = require('express');
const bodyParser = require('body-parser');

require('dotenv').config();

const app = express();

const HOST = process.env.APP_HOST;
const PORT = process.env.APP_PORT;

// Midllewares
app.use(bodyParser.json());

// Routes
app.use('/', require('./routes/indexController'));
app.use('/auth', require('./routes/authController'));
app.use('/messages', require('./routes/messagesController'));

app.listen(PORT, () =>  console.log(`Server listening on http://${HOST}:${PORT}`));