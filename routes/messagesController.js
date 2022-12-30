const express = require('express');
const { tokenAuth } = require('../middlewares/tokenChecker');
const { getMessages, postMessage, deleteMessage } = require('../models/messagesModel');

const messagesRouter = express.Router();

messagesRouter.all('/', tokenAuth())

messagesRouter.get('/', (req, res) => {
    let status = getMessages();
    res.status(status.code).json(status);
});

messagesRouter.post('/', (req, res) => {
    let status = postMessage(res.locals.user, req.body);
    res.status(status.code).json(status);
});

messagesRouter.delete('/', (req, res) => {
    let status = deleteMessage(res.locals.user, req.body);
    res.status(status.code).json(status);
});

module.exports = messagesRouter;