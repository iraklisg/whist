// see https://medium.com/@danmolitor/writing-tests-for-mongo-mongoose-with-mocha-7e98be740074

const request = require('supertest');
const chai = require('chai');

const {setupDatabase} = require('./test_helpers');
const User = require('../models/User');
const {app} = require('../app');

const expect = chai.expect;
chai.should();
chai.use(require('chai-things'));
chai.use(require('chai-subset'));

setupDatabase('whist_testing', [User]);

describe('Test USER endpoints', () => {

    // We cannot use async/await  (⌣_⌣”) (see https://github.com/mochajs/mocha/issues/2407)

    describe('GET /users', () => {
        it('should list all users', (done) => {
            // Provided we have three users stored in our database
            const users = [
                {username: 'john'},
                {username: 'jane'},
                {username: 'alice'},
            ];
            User.create(users)
                .then(() => { // resolves with created users
                    // Make the HTTP request
                    request(app)
                        .get('/users')
                        .expect(200)
                        .expect(res => {
                            res.body.should.containSubset(users)
                        })
                        .end(done);
                });
        });
    });

    describe('GET /users/:username', () => {
        it('should return a user when username is provided', (done) => {
            // Provided we have a user stored in database
            const user = {username: 'Polly'};
            User.create(user)
                .then(() => {
                    request(app)
                        .get(`/users/${user.username}`)
                        .expect(200)
                        .expect(res => {
                            res.body.should.contain.an.item.with.property('username', user.username)
                        })
                        .end(done);
                })
        });
    });

    describe('POST /users', () => {
        it('should create a new user', (done) => {
            const data = {username: 'Hellen'};
            request(app)
                .post('/users')
                .send(data)
                .expect(200)
                .expect(res => {
                    expect(res.body).to.have.a.property('username', data.username)
                })
                .end(done);
        })
    });

    describe('PUT /users/:id', () => {
        it('should update and return the updated user', (done) => {
            // Given we have a user stored in database
            const user = {username: 'Patric'};
            User.create(user)
                .then(() => {
                    request(app)
                        .put('/users/:id')
                        .send({username: 'Patric_updated'})
                        .expect(200)
                        .expect(res => {
                            expect(res.body).to.have.a.property('username', 'Patric_updated')
                        })
                        .end(done);
                })
        })
    })
});