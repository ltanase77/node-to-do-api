
const {ObjectID} = require('mongodb');
const {Todo} = require('./../../models/todo.js');
const {User} = require('./../../models/users.js');
const jwt = require('jsonwebtoken');
const userOneID = new ObjectID();
const userTwoID = new ObjectID();

const users = [
    {
        _id: userOneID,
        email: 'ltanase77@gmail.com',
        password: 'passone',
        tokens: [
            {
                access: 'auth',
                token: jwt.sign( {_id: userOneID, access: 'auth'}, process.env.JWT_SECRET).toString(),
            },
        ],
    },
    {
        _id: userTwoID,
        email: 'luciant@gmail.com',
        password: 'passtwo',
        tokens: [
            {
                access: 'auth',
                token: jwt.sign( {_id: userTwoID, access: 'auth'}, process.env.JWT_SECRET).toString(),
            },
        ],
    },
];


const todos = [
    {
        _id: new ObjectID(),
        text: "First test todo",
        _creator: userOneID,
    },
    {
        _id: new ObjectID(),
        text: "Second test todo",
        completed: true,
        completedAt: 333,
        _creator: userTwoID,
    },
];

const populateTodos = (done) => {
    Todo.remove({}).then( () => {
        return Todo.insertMany(todos);
    }).then(() => done());
};

const populateUsers = (done) => {
    User.remove({}).then( () => {
        const UserOne = new User(users[0]).save();
        const UserTwo = new User(users[1]).save();
        return Promise.all([UserOne, UserTwo]);
    }).then(() => done());
};

module.exports = {todos, populateTodos, users, populateUsers};
