const express = require('express');
const { checkToken } = require('../helpers/JWT');
const checkMethods = require('../middlewares/methodChecker');

const authRouter = express.Router();

const { authenticate, register, refresh } = require('../models/authModel');


// Middleware
authRouter.all('/', checkMethods(['POST']));
authRouter.all('/register', checkMethods(['POST']));
authRouter.all('/refresh', checkMethods(['POST']));


// Routes
authRouter.post('/', (req, res) => {
    let status = authenticate(req.body);
    res.status(status.code).json(status);
});

authRouter.post('/register', (req, res) => {
    let status = register(req.body);
    res.status(status.code).json(status);
});

authRouter.post('/refresh', (req, res) => {
    let status = refresh(req.headers);
    res.status(status.code).json(status);
})


module.exports = authRouter;