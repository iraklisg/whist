const chai = require('chai');

const User = require('../models/User');
const {updateUser} = require('../services/users');
const h = require('./testHelpers');

const expect = chai.expect;

before(() => h.connect('whist_testing'));

beforeEach(() => User.create({username: 'Eugene'}));

afterEach(() => h.clear(User));

after(() => h.disconnectAll());

describe('USER service', () => {

    describe('#updateUser()', () => {
        it('should update a user in database', () => {
            // Given we have a user stored in database
            return User.find({username: 'Eugene'})
                .then((user) => {
                    // console.log(user);
                    return updateUser(user.id, {username: 'Mr. Crabs'})
                })
                .then(res => {
                    // console.log(res);
                    expect(res.username).to.equals('Mr. Crabs');
                })
        });
    });
});
