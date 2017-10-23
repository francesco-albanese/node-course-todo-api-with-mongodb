let mongoose = require('mongoose');

//define the model as a schema, so we tell Mongoose how it should be storing data
const Todo = mongoose.model('Todo', {
    text: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    }, 
    completed: {
        type: Boolean,
        default: false
    }, 
    completedAt: {
        type: Number,
        default: null
    }
});

module.exports = { Todo };