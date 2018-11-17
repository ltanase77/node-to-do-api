const expect = require('expect');
const supertest = require('supertest')

const {app} = require('./../server.js');
const {Todo} = require('./../models/todo.js');

const todos = [
    { 
    text: "First test todos"
    }, 
    {
    text: "Second test todos"
    }
];
beforeEach((done) => {
    Todo.remove({}).then( () => {
        return Todo.insertMany(todos);
    }).then( () => done())
});

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

                Todo.find({text}).then((todos) => {
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
                    expect(todos.length).toBe(2);
                    done();
                }).catch((err) =>{
                    done(err)
                });
            });
    })
});

describe('GET /todos', () => {
    it('should get all todos', (done) => {
        supertest(app)
            .get('/todos')
            .expect(200)
            .expect((response) => {
                expect(response.body.todos.length).toBe(2);
            })
            .end(done);
    })
})