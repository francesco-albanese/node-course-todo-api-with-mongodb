const { Todo } = require('./../models/todo')
module.exports = app => {
    app.post('/todos', (req, res) => {
        const todo = new Todo({
            text: req.body.text
        });
    
        todo.save().then(doc => {
            res.send(doc);
        }).catch(err =>  res.status(400).send(err));
    });
}