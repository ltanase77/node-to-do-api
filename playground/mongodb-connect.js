//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/ToDoApp', (error, client) => {
    if (error) {
        return console.log('Unable to coonect to MongoDB server');
    }

    console.log('Connected to MongoDB Server');
    const database = client.db('TodoApp');

    /* database.collection('Todos').insertOne({
        text: 'Something to do',
        completed: false
    }, (error, result) => {
        if (error) {
            return console.log('Unable to inster todo', error);
        }

        console.log(JSON.stringify(result.ops, undefined, 2));
    }) */

    //Insert a new doc in Users collection (name, age, location)
    // database.collection('Users').insertOne({
    //     name: 'Lucian Tanase',
    //     age: 42,
    //     location: 'Bucharest'
    // }, (error, result) => {
    //     if (error) {
    //         return console.log('Unable to insert user', error)
    //     }

    //     console.log(JSON.stringify(result.ops[0]._id.getTimestamp(), undefined, 2));
    // });

    client.close()
})