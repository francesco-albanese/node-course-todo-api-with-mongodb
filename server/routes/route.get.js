const { Todo } = require('./../models/todo')
const { User } = require('./../models/user')
const { ObjectID } = require('mongodb')
const { authenticate } = require('./../middleware/authenticate')

module.exports = app => {
    app.get('/todos', authenticate, (req, res) => {
        const _creator = req.user._id
        Todo.find({ _creator }).then(todos => {
            res.send({todos})
        }).catch(err => res.status(500).send(err))
    })

    app.get('/todos/:id', authenticate, (req, res) => {
        const { id } = req.params
        const idIsValid = ObjectID.isValid(id)
        const _creator = req.user._id
        if (!idIsValid) {
            return res.status(404).send()
        }
        Todo.findOne({ 
            _id: id,
            _creator
        }).then(todo => {
            if (!todo) {
                return res.status(404).send()
            }
            res.status(200).send({todo})
        }).catch(err => {
            res.status(400).send();
        });
    })

    app.get('/users/me', authenticate, (req, res) => {
        res.send(req.user)
    })
}