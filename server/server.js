require('./config/config') //set environment variables
const express = require('express')
const bodyParser = require('body-parser')
const _ = require('lodash')
const cors = require('cors')

const { mongoose } = require('./db/mongoose')
const { Todo } = require('./models/todo')
const { User } = require('./models/user')

const port = process.env.PORT
const app = express()

const routes = require('./routes/routes')()


//with this we can now send JSON to the server
app.use(bodyParser.json())

app.use(cors())

//initialise routes
_.forEach(routes, route => route(app))

app.listen(port, () => console.log(`Started on port ${port}`))

module.exports = { app }
