const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/ToDoApp', (error, client) => {
    if (error) {
        return console.log('Unable to coonect to MongoDB server');
    }

    console.log('Connected to MongoDB Server');
    const database = client.db('TodoApp');

    database.collection('Users').findOneAndUpdate(
        {
            name: 'Matei Tanase',
        },
        {
            $set: {
                name: 'Razvan-Matei Tanase',
            },

            $inc: {
                age: +1,
            },
        },
        {
            returnOriginal: false,
        })
        .then((result) => {
            console.log(result);
        }).catch((error) => {
            console.log('Unable to make the changes', error);
        });
    // client.close()
});
