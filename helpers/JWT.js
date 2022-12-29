const JWT = require('jsonwebtoken');

const { getCurrentTimestamp } = require('./dateFormat');

exports.generateAuthToken = data => {
       return JWT.sign({
            type: 'authtoken',
            iat: ~~(Date.now() / 1000),
            id: data.id
       }, process.env.JWT_SECRET);
};

exports.generateToken = data => {
    return JWT.sign({
        type: 'token',
        iat: ~~(Date.now() / 1000),
        id: data.id,
        username: data.username,
    }, process.env.JWT_SECRET);
};


exports.checkToken = token => {
    try {
        const payload = JWT.verify(token, process.env.JWT_SECRET);

        if (!this.checkDate(payload)) return false;

        return payload;

    } catch(err)
    {
        console.log(err);
        return false;
    }
};

exports.checkDate = payload => {

    if (payload.type == 'authtoken') {
        // return payload.iat + 604800 >= getCurrentTimestamp();
        return payload.iat + 90 >= getCurrentTimestamp();
    } else if (payload.type == 'token') {
        // return payload.iat + 900 >= getCurrentTimestamp();
        return payload.iat + 30 >= getCurrentTimestamp();
    }
};