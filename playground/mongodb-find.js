const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/ToDoApp', (error, client) => {
    if (error) {
        return console.log('Unable to coonect to MongoDB server');
    }

    console.log('Connected to MongoDB Server');
    const database = client.db('TodoApp');

/*     database.collection('Todos').find({
        _id: new ObjectID('5bcc5eddca62732f0461c748')
    }).toArray().then( (docs) => {
        console.log('Todos');
        console.log(JSON.stringify(docs, undefined, 2));
    }).catch ((err) => {
        console.log('Unable to fetch todos', err);
    }); */

   /*  database.collection('Todos').find().count().then( (count) => {
        console.log(`Todos count: ${count}`);
    }).catch ((err) => {
        console.log('Unable to cont documents', err);
    }); */

    database.collection('Users').find({location: 'Bucharest'}).toArray().then((users) => {
        console.log(JSON.stringify(users, undefined, 2));
    }).catch((err) => {
        console.log('Unable to fetch users', err);
    })

    //client.close()
})