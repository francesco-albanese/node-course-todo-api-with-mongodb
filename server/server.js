const express = require('express');
const bodyParser = require('body-parser');


let { mongoose } = require('./db/mongoose');
let { Todo } = require('./models/todo');
let { User } = require('./models/user');

let app = express();

//with this we can now send JSON to the server
app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    let todo = new Todo({
        text: req.body.text
    });

    todo.save().then(doc => {
        res.send(doc);
    }).catch(err => {
        res.status(400).send(err)
    });
});

// GET /todos/1344aasd78s00fsd

app.listen('3000', () => {
    console.log(`Started on port ${3000}`)
});
