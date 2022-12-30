const QueryBuilder = require('nodejs-mysql-querybuilder');
const sanitizer = require('sanitizer');
const bcrypt = require('bcrypt');
const { formatDate } = require('../helpers/dateFormat');
const { generateAuthToken, generateToken, checkToken } = require('../helpers/JWT');

require('dotenv').config();

const db = new QueryBuilder({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

db.connect();
db.setTable('users');

exports.register = data => {
    if(!data.hasOwnProperty('username')
        || !data.hasOwnProperty('password')
        || !data.hasOwnProperty('cpassword'))
    {
        return {
            code: 400,
            message: "Missing fields"
        };
    }

    if (data['username'] == ''
        || data['password'] == ''
        || data['cpassword'] == '')
    {
        return {
            code: 400,
            message: "Fields cannot be empty"
        };
    }

    let username = sanitizer.escape(data['username']);

    let check = db.select('id').where('username', username).execute().fetch();

    if (check != 0)
    {
        return {
            code: 400,
            message: "Username already exists"
        };
    }

    if (data['password'] != data['cpassword'])
    {
        return {
            code: 400,
            message: "Passwords does not match"
        };
    }
    const hash = bcrypt.hashSync(data['password'], 10);
    try {
        db.insert({
            username: username,
            password: hash,
            register_date: formatDate(new Date())
        }).execute();
    } catch (err)
    {
        return {
            code: 400,
            message: err
        };
    }

    return {
        code: 201,
        message: "User has been registered"
    };
}

exports.authenticate = data => {
    if (!data.hasOwnProperty('username')
        || !data.hasOwnProperty('password'))
    {
        return {
            code: 400,
            message: "Missing fields"
        };
    }

    if (data['username'] == ''
        || data['password'] == '')
    {
        return {
            code: 401,
            message: "Fields cannot be empty"
        };
    }

    let username = sanitizer.escape(data['username']);

    let res = db.select('id, username, avatar, password').where('username', username).execute().fetch();

    if (!res) return {
        code: 401,
        message: "User does not exist"
    };

    if (!bcrypt.compareSync(data['password'], res.password)) return {
        code: 401,
        message: "Incorrect password"
    };

    return {
        code: 200,
        message: "Authenticate success",
        authtoken: generateAuthToken(res),
        token: generateToken(res),
        user_id: res.id,
        username: res.username
    };
}

exports.refresh = headers => {
    if (!headers.hasOwnProperty('authtoken')) return {
        code: 417,
        message: "Missing auth token"
    };

    if (headers['authtoken'] == '') return {
        code: 417,
        message: "Token cannot be empty"
    };

    const authToken = headers['authtoken'];

    const payload = checkToken(authToken);

    if (!payload) return {
        code: 417,
        message: "Auth token invalid"
    }

    let data = db.select('id, username').where('id', payload.id).execute().fetch();
    
    if (!data) return {
        code: 404,
        message: "User does not exist"
    };

    return {
        code: 200,
        token: generateToken(data),
        username: data.username
    }
}
