const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/ToDoApp', (error, client) => {
    if (error) {
        return console.log('Unable to coonect to MongoDB server');
    }

    console.log('Connected to MongoDB Server');
    const database = client.db('TodoApp');

    //delete many
    database.collection('Users').deleteMany({location: 'San Francisco'}).then((result) => {
        console.log(result);
    })
    //delete one
    /* database.collection('Todos').deleteOne({text: 'Eat lunch'}).then((result) => {
        console.log(result);
    }) */
    //find one and delete
    database.collection('Users').findOneAndDelete({name: 'Los Amigos'}).then((result) => {
        console.log(result);
    });
    //client.close()

});