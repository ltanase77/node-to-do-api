const expect = require('expect');
const supertest = require('supertest');

const {app} = require('./../server.js');
const {Todo} = require('./../models/todo.js');
const {User} = require('./../models/users.js');
const {ObjectID} = require('mongodb');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateTodos);
beforeEach(populateUsers);

describe('POST /todos', function() {
    it('should create a new todo', function(done) {
        this.timeout(3500);
        const text = "A new todo";
        supertest(app)
            .post('/todos')
            .set('x-auth', users[0].tokens[0].token)
            .send({text})
            .expect(200)
            .expect(function(response) {
                expect(response.body.text).toBe(text);
            })
            .end(function(err, response) {
                if (err) {
                    return done(err);
                }

                Todo.find({text}).then(function(todos) {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch(function(err) {
                    done(err);
                });
            });
    });

    it("should not create todo", function(done) {
        supertest(app)
            .post('/todos')
            .set('x-auth', users[0].tokens[0].token)
            .send({})
            .expect(400)
            .end(function(err, response) {
                if (err) {
                    return done(err);
                }
                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch(function(err) {
                    done(err);
                });
            });
    });
});

describe('GET /todos', function() {
    it('should get all todos', function(done) {
        supertest(app)
            .get('/todos')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect( function(response) {
                expect(response.body.todos.length).toBe(1);
            })
            .end(done);
    });
});

describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
        supertest(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((response) => {
                expect(response.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('should return a 404 if todo not found', (done) => {
        supertest(app)
            .get(`/todos/${new ObjectID().toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it('should return a 404 if id is not valid', (done) => {
        supertest(app)
            .get('/todos/123')
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it('should not return todo doc created by another user', (done) => {
        supertest(app)
            .get(`/todos/${todos[1]._id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });
});

describe('DELETE /todos/:id', () => {
    it('should delete a todo', (done) => {
        const hexId = todos[1]._id.toHexString();
        supertest(app)
            .delete(`/todos/${hexId}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(200)
            .expect((response) => {
                expect(response.body.todo._id).toBe(hexId);
            })
            .end((err, response) => {
                if (err) {
                    return done(err);
                }
                // query database with findById
                Todo.findById(hexId).then((todo) => {
                    expect(todo).toBeFalsy();
                    done();
                }).catch((err) => {
                    done(err);
                });
            });
    });

    it('should not delete a todo of another user', (done) => {
        const hexId = todos[0]._id.toHexString();
        supertest(app)
            .delete(`/todos/${hexId}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end((err, response) => {
                if (err) {
                    return done(err);
                }
                // query database with findById
                Todo.findById(hexId).then((todo) => {
                    expect(todo).toBeTruthy();
                    done();
                }).catch((err) => {
                    done(err);
                });
            });
    });

    it('should return 404 when todo not found', (done) => {
        supertest(app)
            .delete(`/todos/${new ObjectID().toHexString()}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it('should return 404 if object is is invalid', (done) => {
        supertest(app)
            .delete('/todos/123')
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end(done);
    });
});

describe('PATCH /todos/:id', () => {
    it('should update a todo', (done) => {
        // grab id of first item
        const id = todos[0]._id.toHexString();
        const text = "This is a new updated todo";
        supertest(app)
            .patch(`/todos/${id}`)
            .set('x-auth', users[0].tokens[0].token)
            .send({
                completed: true,
                text: text,
            })
            .expect(200)
            .expect((response) => {
                expect(response.body.todo.text).toBe(text);
                expect(response.body.todo.completed).toBe(true);
                expect(typeof response.body.todo.completedAt).toBe('number');
            })
            .end(done);
    });

    it('should not update a todo of another user', (done) => {
        // grab id of first item
        const id = todos[1]._id.toHexString();
        const text = "This is a new updated todo";
        supertest(app)
            .patch(`/todos/${id}`)
            .set('x-auth', users[0].tokens[0].token)
            .send({
                completed: true,
                text: text,
            })
            .expect(404)
            .end(done);
    });

    it('should clear completedAt when to do is not completed', (done) => {
        const id = todos[1]._id.toHexString();
        const text = "This is a second update to a todo";
        supertest(app)
            .patch(`/todos/${id}`)
            .set('x-auth', users[1].tokens[0].token)
            .send({
                completd: false,
                text: text,
            })
            .expect(200)
            .expect((response) => {
                expect(response.body.todo.text).toBe(text);
                expect(response.body.todo.completed).toBe(false);
                expect(response.body.completedAt).toBeFalsy();
            })
            .end(done);
        // grab id of the second item
        // update text, set completed to false
        // text is changed, completed is false and completedAt is null
    });
});

describe('GET /users/me', function() {
    it('should return user if authenticated', function(done) {
        supertest(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect(function(response) {
                expect(response.body._id).toBe(users[0]._id.toHexString());
                expect(response.body.email).toBe(users[0].email);
            })
            .end(done);
    });

    it('should return 401 if user not authenticated', function(done) {
        supertest(app)
            .get('/users/me')
            .expect(401)
            .expect(function(response) {
                expect(response.body).toEqual({});
            })
            .end(done);
    });
});

describe('POST /user', function() {
    it('should create a user', function(done) {
        const email = "example@example.com";
        const password = "123abc";

        supertest(app)
            .post('/users')
            .send({email: email, password: password})
            .expect(200)
            .expect(function(response) {
                expect(response.headers['x-auth']).toBeTruthy();
                expect(response.body._id).toBeTruthy();
                expect(response.body.email).toBe(email);
            })
            .end(function(error) {
                if (error) {
                    return done(error);
                }
                User.findOne({email}).then(function(user) {
                    expect(user).toBeTruthy();
                    expect(user.pasword).not.toBe(password);
                    done();
                }).catch((error) => {
                    done(error);
                });
            });
    });

    it('should return validation error is request is invalid', function(done) {
        supertest(app)
            .post('/users')
            .send({
                email: 'and',
                password: '123',
            })
            .expect(400)
            .end(done);
    });

    it('should not create a user id email in use', function(done) {
        supertest(app)
            .post('/users')
            .send({
                email: users[0].email,
                password: 'passone',
            })
            .expect(400)
            .end(done);
    });
});

describe('POST /users/login', function() {
    it('should login user and return auth token', (done) => {
        supertest(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: users[1].password,
            })
            .expect(200)
            .expect((response) => {
                expect(response.headers['x-auth']).toBeTruthy();
            })
            .end((error, response) => {
                if (error) {
                    return done(error);
                }
                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens[1]).toMatchObject({
                        access: 'auth',
                        token: response.headers['x-auth'],
                    });
                    done();
                }).catch((error) => {
                    done(error);
                });
            });
    });

    it('should reject invalid token', (done) => {
        supertest(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: users[1].password + 1,
            })
            .expect(400)
            .expect((response) => {
                expect(response.headers['x-auth']).toBeFalsy();
            })
            .end((error, response) => {
                if (error) {
                    return done(error);
                }
                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens.length).toBe(1);
                    done();
                }).catch((error) => {
                    done(error);
                });
            });
    });
});

describe('DELETE /users/me/token', function() {
    it("should remove auth token on logout", function(done) {
        supertest(app)
            .delete('/users/me/token')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .end((error, response) => {
                if (error) {
                    return done(error);
                }
                User.findById(users[0]._id).then((user) => {
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch((error) => {
                    done(error);
                });
            });
    });
});
