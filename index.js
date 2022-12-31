const express = require('express');
const bodyParser = require('body-parser');

require('dotenv').config();

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

module.exports = io;

const HOST = process.env.APP_HOST;
const PORT = process.env.APP_PORT;

// Midllewares
app.use(bodyParser.json());

// Routes
app.use('/', require('./routes/indexController'));
app.use('/auth', require('./routes/authController'));
app.use('/messages', require('./routes/messagesController'));

http.listen(PORT, () =>  console.log(`Server listening on http://${HOST}:${PORT}`));