const express = require('express')
const bodyParser = require('body-parser')

const {mongoose} = require('./db/mongoose')
const {Todo} = require('./models/todo')
const {User} = require('./models/users')

const app = express();

app.use(bodyParser.json());

app.post('/todos', (request, response) => {
    let todo = new Todo({
        text: request.body.text
    })

    todo.save().then((doc) => {
        response.send(doc);
    }).catch((err) => {
        response.status(400).send(err);
    })
});

app.get('/todos', (request, response) => {
    Todo.find().then((todos) => {
        response.send({todos})
    }).catch( (err) => {
        response.status(400).send(err);
    });
})

app.listen(3000, () => {
    console.log('Started on port 3000');
});

module.exports = {
    app: app
}