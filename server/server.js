const express = require('express');
const bodyParser = require('body-parser');


const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');

const app = express();

//with this we can now send JSON to the server
app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    const todo = new Todo({
        text: req.body.text
    });

    todo.save().then(doc => {
        res.send(doc);
    }).catch(err => {
        if (!req.body || !req.body.text.length) {
            return res.status(400).send(err)
        }
        res.status(500).send(err)
    });
});

app.get('/todos', (req, res) => {
    Todo.find().then(todos => {
        res.send({todos})
    }).catch(err => res.status(500).send(err))
})

// GET /todos/1344aasd78s00fsd

app.listen('3000', () => {
    console.log(`Started on port ${3000}`)
});

module.exports = { app };
