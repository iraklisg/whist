const chai = require('chai');

const User = require('../models/User');
const {putUser} = require('../controllers/users');
const h = require('./testHelpers');

const expect = chai.expect;

before(() => {
    return h.connect('whist_testing')
});

beforeEach(() => {
    return h.clear(User);
});

after(() => {
    return h.disconnectAll();
});

describe('USER controller', () => {

    describe('#updateUser()', () => {
        it('should update a user in database', (done) => {
            // Given we have a user stored in database
            User.create({username: 'Eugene'})
                .then(user => {
                    const id = user.id
                        , formData = {username: 'Mr. Crabs'};

                    return putUser(id, formData) // return a promise
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