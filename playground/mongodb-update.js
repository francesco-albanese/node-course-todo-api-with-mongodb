const { 
    MongoClient,
    ObjectID  } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err) {
        return console.log(`Unable to connect to MongoDB server`);
    }
    console.log('Connected to MongoDB server');

    // db.collection('Todos').findOneAndUpdate({_id: new ObjectID("59ee272eba490d3c45ced2ae")}, 
    // {
    //     $set: {
    //         completed: true
    //     }
    // },
    // {
    //     returnOriginal: false
    // }).then(res => {
    //     console.log(res);
    // })

    db.collection('Users').findOneAndUpdate({_id: new ObjectID("59ed1ad7adb1c911e2b1cedc")},
    {
       $set: {
           name: "Francesco"
       },
       $inc: {
           age: -1
       } 
    }, {
        returnOriginal: false
    }).then(res => {
        console.log(res);
    })

    // db.close();
});