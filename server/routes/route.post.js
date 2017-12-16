const { Todo } = require('./../models/todo')
const { User } = require('./../models/user')
const _ = require('lodash')
const { authenticate } = require('./../middleware/authenticate')

function postRequests(app) {
    app.post('/todos', authenticate, (req, res) => {
        const todo = new Todo({
            text: req.body.text,
            _creator: req.user._id
        });
        
        todo.save().then(doc => {
            res.send(doc);
        }).catch(err =>  res.status(400).send(err));
    });

    app.post('/users', (req, res) => {
        const body = _.pick(req.body, ['email', 'password'])
        const user = new User(body)

        user.save().then(() => user.generateAuthToken()).then(token => {
            res.header('x-auth', token).send(user)
        }).catch(e => res.status(400).send(e))
    })

    app.post('/users/login', (req, res) => {
        const body = _.pick(req.body, ['email', 'password'])
        
        User.findByCredentials(body.email, body.password).then(user => {
            return user.generateAuthToken().then(token => {
                res.header('x-auth', token).send(user) 
            })
        }).catch(e => res.status(400).send(e))
    })
}

module.exports = postRequests