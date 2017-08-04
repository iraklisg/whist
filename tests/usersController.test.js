const chai = require('chai');

const User = require('../models/User');
const {updateUser} = require('../controllers/users');
const {setupDatabase} = require('./test_helpers');

const expect = chai.expect;

setupDatabase('whist_testing', [User]);

describe('USER controller', () => {

    describe('#updateUser()', () => {
        it('should update a user in database', (done) => {
            // Given we have a user stored in database
            User.create({username: 'Eugene'})
                .then(user => {
                    const id = user.id
                        , formData = {username: 'Mr. Crabs'};

                    return updateUser(id, formData) // return a promise
                                                    // see also https://stackoverflow.com/questions/26571328/how-do-i-properly-test-promises-with-mocha-and-chai
                })
                .then(res => {
                    expect(res.username).to.equals('Mr. Crabs');
                    done();
                })
                .catch(err => done(err))
        });
    });
});