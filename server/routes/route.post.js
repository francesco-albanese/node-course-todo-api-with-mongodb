const { Todo } = require('./../models/todo')
module.exports = app => {
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
}