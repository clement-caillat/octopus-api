const { checkToken } = require("../helpers/JWT");
const { refresh } = require("../models/authModel");

exports.tokenAuth = () => (req, res, next) => {
    
    if (!req.headers.hasOwnProperty('token')
        || !req.headers.hasOwnProperty('authtoken'))
    {
        return res.status(401).json({
            message: 'No token found'
        });
    }

    if (req.headers['token'] == ''
        || req.headers['authtoken'] == '')
    {
        return res.status(401).json({
            message: 'Token cannot be empty'
        });
    }


    if (!checkToken(req.headers['authtoken']))
    {
        return res.status(401).json({
            code: "ERR_AUTH",
            message: "Invalid Auth Token"
        });
    }

    const payload = checkToken(req.headers['token']);

    
    if (!payload)
    {
        return res.status(417).json(refresh(req.headers));
    }

    res.locals.user = payload;

    next();
};

