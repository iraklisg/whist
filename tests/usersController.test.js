const chai = require('chai');

const User = require('../models/User');
const {putUser} = require('../controllers/users');
const h = require('./testHelpers');

const expect = chai.expect;

before(() => h.connect('whist_testing'));

beforeEach(() => User.create({username: 'Eugene'}));

afterEach(() => h.clear(User));

after(() => h.disconnectAll());

describe('USER controller', () => {

    describe('#putUser()', () => {
        it('should update a user in database', () => {
            // Given we have a user stored in database
            return User.find({username: 'Eugene'})
                .then(user => putUser(user.id, {username: 'Mr. Crabs'}))
                .then(res => expect(res.username).to.equals('Mr. Crabs'))
        });
    });
});