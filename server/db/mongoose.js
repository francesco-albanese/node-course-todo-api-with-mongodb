const mongoose = require('mongoose');

// tell mongoose to use the default JavaScript Promise Object. This is required
// since mongoose uses callbacks by default but we hate callbacks don't we?
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp', {useMongoClient: true});

module.exports = {
    mongoose
};