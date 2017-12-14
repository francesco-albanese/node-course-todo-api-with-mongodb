const { Todo } = require('./../models/todo')
const { ObjectID } = require('mongodb')
const { authenticate } = require('./../middleware/authenticate')

module.exports = app => {
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

    app.delete('/users/me/token', authenticate, (req, res) => {
        req.user.removeToken(req.token).then(() => {
            res.status(200).send()
        }).catch(e => res.status(400).send(e))
    })
}