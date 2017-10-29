const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');
const { ObjectID } = require('mongodb');
const { User } = require('./../server/models/user');

// let _id = `59efac8d534e401fe44bcc4511`;
let userId = `59ee56b4555f37196c010afe`;

// if (!ObjectID.isValid(_id)) {
//     console.log('Id not valid!');
// }

// Todo.find({
//     _id
// }).then(todos => {
//     console.log('Todos', todos)
// })

// Todo.findOne({
//     _id
// }).then(todo => {
//     console.log('Todos', todo)
// })

// Todo.findById(_id).then(todo => {
//     if (!todo) {
//         return console.log('Id not found')
//     }
//     console.log('Todo findbyId', todo)
// }).catch(err => {
//     console.log(err);
// })

User.findById(userId).then(user => {
    if (!user) {
        return console.log('User not found')
    }

    console.log(JSON.stringify(user, null, 2))
}).catch(err => console.error(err));