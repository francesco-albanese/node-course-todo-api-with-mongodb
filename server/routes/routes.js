const get = require('./route.get')
const post = require('./route.post')
const patch = require('./route.patch')
const deleteRoute = require('./route.delete')

module.exports = app => [get.bind(app), post.bind(app), patch.bind(app), deleteRoute.bind(app)];