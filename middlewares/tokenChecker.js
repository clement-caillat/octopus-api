const { checkToken } = require("../helpers/JWT");

exports.tokenAuth = () => (req, res, next) => {
    
    if (!req.headers.hasOwnProperty('token')
        || !req.headers.hasOwnProperty('authtoken'))
    {
        return res.status(417).json({
            message: 'No token found'
        });
    }

    if (req.headers['token'] == ''
        || req.headers['authtoken'] == '')
    {
        return res.status(417).json({
            message: 'Token cannot be empty'
        });
    }


    if (!checkToken(req.headers['authtoken']))
    {
        return res.status(417).json({
            code: "ERR_AUTH",
            message: "Invalid Auth Token"
        });
    }

    if (!checkToken(req.headers['token']))
    {
        return res.status(417).json({
            code: "ERR_REFRESH",
            message: "Invalid Token"
        });
    }


    next();
};

