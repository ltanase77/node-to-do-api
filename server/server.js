const express = require('express');
const bodyParser = require('body-parser');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/users');
const {ObjectID} = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', (request, response) => {
    let todo = new Todo({
        text: request.body.text
    });

    todo.save().then((doc) => {
        response.send(doc);
    }).catch((err) => {
        response.status(400).send(err);
    });
});

app.get('/todos', (request, response) => {
    Todo.find().then((todos) => {
        response.send({todos});
    }).catch( (err) => {
        response.status(400).send(err);
    });
});

// GET individual todo
app.get('/todos/:id', (request, response) => {
    const id = request.params.id;

    if (!ObjectID.isValid(id)) {
        response.status(404).send();
    }

    Todo.findById(id).then((todo) => {
        if (todo) {
            response.status(200).send({todo});
        } else {
            response.status(404).send({});
        }
    }).catch((err) => {
        response.status(400).send();
    });
});

app.delete('/todos/:id', (request, response) => {
    // get the id
    const id = request.params.id;
    // validate id -> not valid? return 404
    if (!ObjectID.isValid(id)) {
        return response.status(404).send();
    }
    // remove the todo
    Todo.findByIdAndRemove(id).then((todo) => {
        if (todo) {
            response.status(200).send(todo);
        } else {
            response.status(404).send();
        }
    }).catch((err) => {
        response.status(400).send();
    });
});

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

module.exports = {
    app: app,
};
