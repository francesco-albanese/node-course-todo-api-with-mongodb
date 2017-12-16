const expect = require('expect')
const request = require('supertest')
const { ObjectID } = require('mongodb')

const { todos, populateTodos, users, populateUsers  } = require('./seed/seed')

const { app } = require('./../server')
const { Todo } = require('./../models/todo')
const { User } = require('./../models/user')

//beforeEach runs some code before the test runs
beforeEach(populateUsers)
beforeEach(populateTodos)

describe('POST /todos', () => {
    it('should create a new todo', done => {
        let text = "Test todo text"
        
        request(app)
            .post('/todos')
            .set('x-auth', users[0].tokens[0].token)
            .send({text})
            .expect(200)
            .expect(res => {
                expect(res.body.text).toBe(text)
            })
            .end((err, res) => {
                if(err) {
                    return done(err)
                }

                Todo.find({text}).then(todos => {
                    expect(todos.length).toBe(1)
                    expect(todos[0].text).toBe(text)
                    done()
                }).catch(err => done(err))
            })
    })

    it('should not create todo with invalid body data', done => {
        request(app)
            .post('/todos')
            .set('x-auth', users[0].tokens[0].token)
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err)
                }

                Todo.find().then(todos => {
                    expect(todos.length).toBe(2)
                    done()
                }).catch(err => done(err))
            })
    })
})

describe('GET /todos', () => {
    it('should get all todos', done => {
        request(app)
            .get('/todos')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect(res => {
                expect(res.body.todos.length).toBe(1)
            })
            .end(done)

    })
})

describe('GET /todos/:id', () => {
    it('should return todo doc', done => {
        
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect(res => {
                expect(res.body.todo.text).toBe(todos[0].text)
            })
            .end(done)
    })

    it('should not return todo doc created by other user', done => {
        
        request(app)
            .get(`/todos/${todos[1]._id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done)
    })

    it('should return a 404 if todo not found', done => {
        //make a request using a real OBJECTid , call toHEXSTRing
        //make sure you get a 404 back
        const id = new ObjectID().toHexString()
        request(app)
            .get(`/todos/${id}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done)
    })

    it('should return a 404 for non-object ids', done => {
        // /todos/123
        request(app)
            .get('/todos/123')
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done)
    })
})

describe('DELETE /todos/:id', () => {
    it('should delete a todo by id', done => {
        const hexId = todos[1]._id.toHexString()
        request(app)
            .delete(`/todos/${hexId}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(200)
            .expect(res => {
                expect(res.body.todo._id).toBe(hexId)
            }).end((err, res) => {
                if (err) {
                    return done(err)
                }

                Todo.findById(hexId).then(todo => {
                    expect(todo).toNotExist()
                    done()
                }).catch(e => done(e))
            })
    })

    it('should not delete a todo if belongs to a different user', done => {
        const hexId = todos[1]._id.toHexString()
        request(app)
            .delete(`/todos/${hexId}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end((err, res) => {
                if (err) {
                    return done(err)
                }

                Todo.findById(hexId).then(todo => {
                    expect(todo).toExist()
                    done()
                }).catch(e => done(e))
            })
    })

    it('should return 404 if todo not found', done => {
        const id = new ObjectID().toHexString()
        request(app)
            .delete(`/todos/${id}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done)
    })

    it('should return 404 if ObjectID is invalid', done => {
        request(app)
            .delete('/todos/123')
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done)
    })
})

describe('PATCH /todos/:id', () => {
    it('should update the todo', done => { 
        const hexId = todos[1]._id.toHexString()
        const text = "Testing update"
        const completed = true
        request(app)
            .patch(`/todos/${hexId}`)
            .set('x-auth', users[1].tokens[0].token)
            .send({text, completed})
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err)
                }

                Todo.findById(hexId).then(todo => {
                    expect(todo.text).toBe(text)
                    expect(todo.completed).toBe(completed)
                    expect(todo.completedAt).toBeA('number')
                    done()
                }).catch(e => done(e))
            })
    })

    it('should not update the todo if belongs to different user', done => { 
        const hexId = todos[0]._id.toHexString()
        const text = "Testing update"
        const completed = true
        request(app)
            .patch(`/todos/${hexId}`)
            .set('x-auth', users[1].tokens[0].token)
            .send({text, completed})
            .expect(404)
            .end(done)
    })

    it('should clear completedAt when todo is not completed', done => {
        const hexId = todos[0]._id.toHexString()
        const text = "Testing update 2"
        const completed = false
        request(app)
        .patch(`/todos/${hexId}`)
        .set('x-auth', users[0].tokens[0].token)
        .send({text, completed})
        .expect(200)
        .end((err, res) => {
            if (err) {
                return done(err)
            }

            Todo.findById(hexId).then(todo => {
                expect(todo.text).toBe(text)
                expect(todo.completed).toBe(completed)
                expect(todo.completedAt).toNotExist()
                done()
            }).catch(e => done(e))
        })
    })
})

describe('GET /users/me', () => {
    it('should return user if authenticated', done => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect(res => {
                expect(res.body._id).toBe(users[0]._id.toHexString())
                expect(res.body.email).toBe(users[0].email)
            })
            .end(done)
    })

    it('should return 401 if not authenticated', done => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect(res => {
                expect(res.body).toEqual({})
            })
            .end(done)
    })
})

describe('POST /users', () => {
    it('should create a user', done => {
        const email = 'example@example.com'
        const password = '123mnb!'

        request(app)
            .post('/users')
            .send({email, password})
            .expect(200)
            .expect(res => {
                expect(res.headers['x-auth']).toExist()
                expect(res.body._id).toExist()
                expect(res.body.email).toBe(email)
            })
            .end(err => {
                if (err) {
                    return done(err)
                }

                User.findOne({email}).then(user => {
                    expect(user).toExist()
                    expect(user.password).toNotBe(password)
                    done()
                }).catch(e => done(e))
            })
    })

    it('should return validation errors if request invalid', done => {
        const email = 'a.cm'
        const password = '145'

        request(app)
            .post('/users')
            .send({email, password})
            .expect(400)
            .end(done)
    })

    it('should not create user if email already in use', done => {
        const email = users[0].email
        const password = '145abc!'

        request(app)
            .post('/users')
            .send({email, password})
            .expect(400)
            .end(done)
    })
})

describe('/POST /users/login', () => {
    it('should login user and return auth token', done => {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: users[1].password
            })
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toExist()
            })
            .end((err, res) => {
                if (err) {
                    done(err)
                }

                User.findById(users[1]._id).then(user => {
                    expect(user.tokens[1]).toInclude({
                        access: 'auth',
                        token: res.headers['x-auth']
                    })
                    done()
                }).catch(e => done(e))
            })
    })

    it('should reject invalid login', done => {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: users[1].password + 'blah'
            })
            .expect(400)
            .expect((res) => {
                expect(res.headers['x-auth']).toNotExist()
            })
            .end((err, res) => {
                if (err) {
                    done(err)
                }

                User.findById(users[1]._id).then(user => {
                    expect(user.tokens.length).toBe(1)
                    done()
                }).catch(e => done(e))
            })
    })
})

describe('DELETE /users/me/token', () => {
    it('should remove auth token on logout', done => {
        request(app)
            .delete('/users/me/token')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    done(err)
                }
                User.findById(users[0]._id).then(user => {
                    expect(user.tokens.length).toBe(0)
                    done()
                }).catch(e => done(e))
            })
    })
})