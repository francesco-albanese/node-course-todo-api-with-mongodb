const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');
const { ObjectID } = require('mongodb');
const { User } = require('./../server/models/user');

// Todo.remove({}) you have to pass something to this function
// if u pass an empty object it removes everything from the db

// Todo.remove({}).then(result => console.log(result));

// Todo.findOneAndRemove()
// Todo.findByIdAndRemove()

// Todo.findByIdAndRemove(`5a0887ac1d326c309b1641ba`).then(todo => {
//     console.log(todo)
// })

Todo.findOneAndRemove({_id: ""}).then(todo => {
    console.log(todo)
})