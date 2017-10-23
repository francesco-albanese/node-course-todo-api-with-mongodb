const { 
    MongoClient,
    ObjectID  } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err) {
        return console.log(`Unable to connect to MongoDB server`);
    }
    console.log('Connected to MongoDB server');

    //deleteMany
    // db.collection('Todos').deleteMany({text: "Eat lunch"}).then(result => {
    //     console.log(result);
    // })

    //deletOne
    // db.collection('Todos').deleteOne({text: "Eat lunch"}).then(result => {
    //     console.log(result);
    // })
    
    //findOneAndDelete
    // db.collection('Todos').findOneAndDelete({completed: false}).then(res => {
    //     console.log(res);
    // });

    // db.collection('Users').deleteMany({name: "Francesco"}).then(res => {
    //     console.log(JSON.stringify(res, null, 2));
    // })
    db.collection('Users').findOneAndDelete({_id: new ObjectID("59ed1c2d39c4a51226598684")}).then(res => {
        console.log(res);
    });

    // db.close();
});