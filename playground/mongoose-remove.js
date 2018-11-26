const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose.js');
const {Todo} = require('./../server/models/todo.js');
const {User} = require('./../server/models/users.js');

/* Todo.remove({}).then((result) => {
    console.log(result);
}); */

// Todo.findOneAndRemove()
Todo.findByIdAndRemove('5bfc4e6557caa13e685d27a9').then((todo) => {
    console.log(todo);
});
