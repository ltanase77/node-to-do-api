const expect = require('expect');
const supertest = require('supertest')

const {app} = require('./../server.js');
const {Todo} = require('./../models/todo.js');

beforeEach((done) => {
    Todo.remove({}).then( () => {
        done();
    })
})

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        let text = "A new todo";
        supertest(app)
            .post('/todos')
            .send({
                text: text
            })
            .expect(200)
            .expect((response) => {
                expect(response.body.text).toBe(text);
            })
            .end((err, response) => {
                if (err) {
                    return done(err);
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((err) => {
                    done(err);
                });
            });
    })

    it("should not create todo", (done) => {
        supertest(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, response) => {
                if (err) {
                    return done(err);
                }
                Todo.find().then((todos) => {
                    expect(todos.length).toBe(0);
                    done();
                }).catch((err) =>{
                    done(err)
                });
            });
    })
})