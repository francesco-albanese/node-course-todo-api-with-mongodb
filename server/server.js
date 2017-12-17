require('./config/config') //set environment variables

const express = require('express')
const bodyParser = require('body-parser')
const _ = require('lodash')
const cors = require('cors')
const morgan = require('morgan')

const { mongoose } = require('./db/mongoose')
const { Todo } = require('./models/todo')
const { User } = require('./models/user')

const port = process.env.PORT
const app = express()

const routes = require('./routes/routes')()


//with this we can now handle better the request body object
app.use(bodyParser.json())
app.use(morgan('dev'))
app.use(cors())

//initialise routes
_.forEach(routes, route => route(app))

app.use((req, res, next) => {
    const error = new Error('Endpoint not found')
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
        error: {
            message: error.message
        }
    })
})

app.listen(port, () => console.log(`Started on port ${port}`))

module.exports = { app }
