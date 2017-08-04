const chai = require('chai');

const User = require('../models/User');
const {updateUser} = require('../services/users');
const {setupDatabase} = require('./test_helpers');

const expect = chai.expect;

setupDatabase('whist_testing', [User]);

describe('USER service', () => {

    describe('#updateUser()', () => {
        it('should update a user in database', (done) => {
            // Given we have a user stored in database
            User.create({username: 'Eugene'})
                .then(user => {
                    const id = user.id
                        , formData = {username: 'Mr. Crabs'};

                    return updateUser(id, formData)
                })
                .then(res => {
                    expect(res.username).to.equals('Mr. Crabs');
                    done();
                })
                .catch(err => done(err))
        });
    });
});
