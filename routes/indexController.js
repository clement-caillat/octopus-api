const express = require('express');

const indexRouter = express.Router();

indexRouter.get('/', (req, res) => {
    res.status(200).json({
        message: "Welcome on the API"
    });
});


module.exports = indexRouter;