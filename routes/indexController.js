const express = require('express');
const { tokenAuth } = require('../middlewares/tokenChecker');

const indexRouter = express.Router();

indexRouter.all('/jwt', tokenAuth())

indexRouter.get('/', (req, res) => {
    res.status(200).json({
        message: "Welcome on the API"
    });
});

indexRouter.get('/jwt', (req, res) => {
    res.status(200).json({
        message: "Congrats, tu as bien ton token et il est valide",
    })
});


module.exports = indexRouter;