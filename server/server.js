require('./config/config.js');
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/users');
const {ObjectID} = require('mongodb');
const {authenticate} = require('./middleware/authenticate');

const app = express();
const port = process.env.PORT;
const env = process.env.NODE_ENV;

app.use(bodyParser.json());

app.post('/todos', authenticate, (request, response) => {
    const todo = new Todo({
        text: request.body.text,
        _creator: request.user._id,
    });

    todo.save().then((doc) => {
        response.send(doc);
    }).catch((err) => {
        response.status(400).send(err);
    });
});

app.get('/todos', authenticate, (request, response) => {
    Todo.find({
        _creator: request.user._id,
    }).then((todos) => {
        response.send({todos});
    }).catch( (err) => {
        response.status(400).send(err);
    });
});

// GET individual todo
app.get('/todos/:id', authenticate, (request, response) => {
    const id = request.params.id;

    if (!ObjectID.isValid(id)) {
        response.status(404).send();
    }

    Todo.findOne({
        _id: id,
        _creator: request.user._id,
    }).then((todo) => {
        if (todo) {
            response.status(200).send({todo});
        } else {
            response.status(404).send({});
        }
    }).catch((err) => {
        response.status(400).send();
    });
});

app.delete('/todos/:id', authenticate, (request, response) => {
    // get the id
    const id = request.params.id;
    // validate id -> not valid? return 404
    if (!ObjectID.isValid(id)) {
        return response.status(404).send();
    }
    // remove the todo
    Todo.findOneAndRemove({
        _id: id,
        _creator: request.user._id,
    }).then((todo) => {
        if (todo) {
            response.status(200).send({todo});
        } else {
            response.status(404).send();
        }
    }).catch((err) => {
        response.status(400).send();
    });
});

app.patch('/todos/:id', authenticate, (request, response) => {
    const id = request.params.id;
    const body = _.pick(request.body, ['text', 'completed']);
    if (!ObjectID.isValid(id)) {
        return response.status(404).send();
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findOneAndUpdate({_id: id, _creator: request.user._id}, {$set: body}, {new: true}).then((todo) => {
        if (!todo) {
            response.status(404).send();
        }
        response.send({todo: todo});
    }).catch((err) => {
        response.status(404).send();
    });
});

app.post('/users', (request, response) => {
    const body = _.pick(request.body, ['email', 'password']);
    const user = new User(body);
    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        response.header('x-auth', token).send(user);
    }).catch((err) => {
        response.status(400).send(err);
    });
});

app.get('/users/me', authenticate, (request, response) => {
    response.send(request.user);
});

app.post('/users/login', (request, response) => {
    const body = _.pick(request.body, ['email', 'password']);
    User.findByCredentials(body.email, body.password).then((user) => {
        return user.generateAuthToken().then((token) => {
            response.header('x-auth', token).send(user);
        });
    }).catch((error) => {
        response.status(400).send({error});
    });
});

app.delete('/users/me/token', authenticate, function(request, response) {
    request.user.removeToken(request.token).then(() => {
        response.status(200).send();
    }).catch((error) => {
        response.send(400).send();
    });
});

app.listen(port, () => {
    console.log(`Started on port ${port}`);
    console.log( `***** ${env} *****`);
});

module.exports = {
    app: app,
};
