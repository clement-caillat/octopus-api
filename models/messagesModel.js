const QueryBuilder = require('nodejs-mysql-querybuilder');
const sanitizer = require('sanitizer');
const { formatDate } = require('../helpers/dateFormat');
const uniqid = require('uniqid');

require('dotenv').config();

const io = require('../index');

io.on('connection', socket => {
    console.log("New connection");
})

const db = new QueryBuilder({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME, 
});

db.connect();
db.setTable('messages');

exports.getMessages = () => {
    const res = db.select('messages.id, messages.content, messages.date, users.username, messages.user_fk').join('INNER', 'users').on('messages.user_fk', 'users.id').execute().fetchAll();
    return {
        code: 200,
        messages: res
    };
}

exports.postMessage = (payload, data) => {
    if (!data.hasOwnProperty('content')) return {
            code: 400,
            message: "Missing message content"
        };

    if (data['content'] == '') return {
        code: 400,
        message: "Message cannot be empty"
    };

    const content = sanitizer.escape(data['content']);
    const id = uniqid(`${Math.floor(Math.random() * 100)}-`);
    try {
        db.insert({
            id: id,
            content: content,
            date: formatDate(new Date()),
            user_fk: payload.id
        }).execute();
    } catch (err)
    {
        return {
            code: 500,
            message: "There was an error"
        };
    }

    io.emit('new_message', {
        id: id,
        content: content,
        user_fk: payload.id,
        username: payload.username
    });

    return {
        code: 200,
        message: "Message has been posted"
    };
}

exports.deleteMessage = (payload, data) => {
    if (!data.hasOwnProperty('id')) return {
        code: 400,
        message: "Missing message id"
    };

    if (data['id'] == '') return {
        code: 400,
        message: "Message id cannot be empty"
    };

    const message_data = db.select('id, user_fk').where('id', data['id']).execute().fetch();

    if (!message_data) return {
        code: 404,
        message: "Message cannot be found"
    };

    if (message_data.user_fk != payload.id) return {
        code: 401,
        message: "Not authorized"
    };

    try {
        db.delete('id', data['id']).execute();
        return {
            code: 200,
            message: "Message has been deleted"
        };
    }catch (err)
    {
        return {
            code: 500,
            message: "There was an error"
        };
    }

}