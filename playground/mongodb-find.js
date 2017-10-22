const { 
    MongoClient,
    ObjectID  } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err) {
        return console.log(`Unable to connect to MongoDB server`);
    }
    console.log('Connected to MongoDB server');
    
    // db.collection('Todos').find({
    //     _id: new ObjectID('59ed1efeba490d3c45cece96')
    // }).toArray().then((docs) => {
    //     console.log('Todos');
    //     console.log(JSON.stringify(docs, null, 2));
    // }).catch(err => console.log('Unable to fetch todo'));

    // db.collection('Todos').find().count().then((count) => {
    //     console.log(`Todos count: ${count}`);
    // }).catch(err => console.log('Unable to fetch todo'));

    db.collection('Users').find({name: "Vanessa"}).toArray().then(docs => {
        console.log(JSON.stringify(docs, null, 2));
    }).catch(err => `Unable to fetch users ${err}`);

    // db.close();
});