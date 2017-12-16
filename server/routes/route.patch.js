const { Todo } = require('./../models/todo')
const { ObjectID } = require('mongodb')
const _ = require('lodash')
const { authenticate } = require('./../middleware/authenticate')

module.exports = app => {
    app.patch('/todos/:id', authenticate, (req, res) => {
        const { id } = req.params
        const body = _.pick(req.body, ['text', 'completed'])
        const isValid = ObjectID.isValid(id)
        const _creator = req.user._id
    
        if(!isValid) {
            return res.status(404).send()
        }
    
        if(_.isBoolean(body.completed) && body.completed) {
            body.completedAt = Date.now()
        } else {
            body.completed = false
            body.completedAt = null
        }
    
        Todo.findOneAndUpdate({_id:id, _creator}, {$set: body}, {new: true}).then(todo => {
            if (!todo) {
                return res.status(404).send()
            }
            res.send({todo})
        }).catch(err => res.status(400).send())
    })
}