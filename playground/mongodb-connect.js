const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err) {
        return console.log(`Unable to connect to MongoDB server`);
    }
    console.log('Connected to MongoDB server');
    
    // db.collection('Todos').insertOne({
    //     text: 'Something to do',
    //     completed: false
    // }, (err, result) => {
    //     if (err) {
    //         return console.log(`Unable to insert todo, ${err}`);
    //     }

    //     console.log(JSON.stringify(result.ops, null, 2));
    // });

    db.collection('Users').insertOne({
        name: "Francesco",
        age: 31,
        location: "Malta"
    }, (err, user) => {
        if (err) {
            return console.log(`Unable to insert user. ${err}`)
        }

        console.log(JSON.stringify(user.ops, null, 2));
    })

    db.close();
});