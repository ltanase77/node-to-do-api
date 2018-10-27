const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/ToDoApp');

const Todo = mongoose.model('Todo', {
    text: {
        type: String
    },
    completed: {
        type: Boolean
    },
    completedAt: {
        type: Number
    }
})

let newTodo = new Todo({
    text: "Learn Mongoose",
    completed: false,
    completedAt: 1
})

newTodo.save().then((doc) => {
    console.log('Saved to do: ', doc)
}).catch((err) => {
    console.log('Unable to save to do');
});