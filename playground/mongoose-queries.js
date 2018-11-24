const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose.js');
const {Todo} = require('./../server/models/todo.js');
const {User} = require('./../server/models/users.js');

let id = '5bf066c0872bd217f4cbcef3';

if (!ObjectID.isValid(id)) {
    console.log('ID not valid!');
}

Todo.find({
    _id: id,
}).then((todos) => {
    console.log('Todos', todos)
});

Todo.findOne({
    _id: id,
}).then((todo) => {
    console.log('Todo:', todo)
});

Todo.findById(id).then((todo) => {
    if (!todo) {
        return console.log("Id not found!");
    }
    console.log('Todo by Id', todo)
}).catch((err) => {
    console.log('Error: ', err);
});

let userId = '5be85194d46f2005ec34c5e8';

User.findById(userId).then( (user) => {
    if (!user) {
        return console.log("User not found!");
    } else {
        console.log("User is: ", user);
    }
}).catch((err) => {
    console.log("User ID is not valid: ", err);
});
