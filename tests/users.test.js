// see https://medium.com/@danmolitor/writing-tests-for-mongo-mongoose-with-mocha-7e98be740074

const request = require('supertest');
const {expect} = require('chai');
const mongoose = require('mongoose');

// const {app} = require('../app');
const User = require('../models/User');

const {setupDatabase} = require('./test_helpers');

setupDatabase('whist_testing', [User]);

describe('Users', () => {
    it('should list all users', (done) => {
        // must connect to testing database
        // must seed with some users
        // assert that we return al users
        User({username: 'lololo'}).save(done);
    });
});