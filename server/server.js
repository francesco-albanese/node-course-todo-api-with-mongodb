require('./config/config'); //set environment variables
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');
const _ = require('lodash');

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');

const app = express();

const port = process.env.PORT;

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

app.get('/todos/:id', (req, res) => {
    const { id } = req.params;
    const idIsValid = ObjectID.isValid(id);
    if (!idIsValid) {
        return res.status(404).send()
    }
    Todo.findById(id).then(todo => {
        if (!todo) {
            return res.status(404).send()
        }
        res.status(200).send({todo})
    }).catch(err => {
        res.status(400).send();
    });
})

app.delete('/todos/:id', (req, res) => {
    const { id } = req.params;
    const isValid = ObjectID.isValid(id);

    if(!isValid) {
        return res.status(404).send()
    }

    Todo.findByIdAndRemove(id).then(todo => {
        if (!todo) {
            return res.status(404).send()
        }
        res.status(200).send({todo})
    }).catch(err => res.status(400).send())
})

app.patch('/todos/:id', (req, res) => {
    const { id } = req.params;
    const body = _.pick(req.body, ['text', 'completed']);
    const isValid = ObjectID.isValid(id);

    if(!isValid) {
        return res.status(404).send()
    }

    if(_.isBoolean(body.completed) && body.completed) {
        body.completedAt = Date.now()
    } else {
        body.completed = false
        body.completedAt = null
    }

    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then(todo => {
        if (!todo) {
            return res.status(404).send()
        }
        res.send({todo})
    }).catch(err => res.status(400).send())
})

app.listen(port, () => {
    console.log(`Started on port ${port}`)
});

module.exports = { app };
