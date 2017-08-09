const request = require('supertest');
const chai = require('chai');

const h = require('../testHelpers');
const {app} = require('../../app');
const Player = require('../../models/Player');

chai.use(require('chai-subset'));
const expect = chai.expect;

/**
 * Connect to testing DB
 */
before(() => {
    return h.connect('whist_testing')
});

/**
 * Clear the given collection
 */
beforeEach(() => {
    return h.clear(Player)
        .then(Player.create([
            {first_name: 'Eugene', last_name: 'Krabs', nickname: 'Mr.Crabs'},
            {first_name: 'Bob', last_name: 'SquarePants', nickname: 'SpongeBob'},
            {first_name: 'Patric', last_name: 'Star', nickname: 'Patric'}
        ]));
});

/**
 * Disconnect from testing DB
 */
after(() => {
    return h.disconnectAll();
});

describe('PLAYER end-points', () => {
    describe('GET /players', () => {
        it('should list all players', () => {
            return request(app)
                .get('/players')
                .expect(200)
                .then(res => {
                    expect(res.body).to.have.lengthOf(3).and.to.containSubset([
                        {first_name: 'Eugene', last_name: 'Krabs', nickname: 'Mr.Crabs'},
                        {first_name: 'Bob', last_name: 'SquarePants', nickname: 'SpongeBob'},
                        {first_name: 'Patric', last_name: 'Star', nickname: 'Patric'}
                    ])
                })
        });
    });

    describe('GET /players/:nickname', () => {
        it('should show the player with nickname', () => {
            return request(app)
                .get('/players/SpongeBob')
                .expect(200)
                .then(res => {
                    expect(res.body).to.have.lengthOf(1).and.to.containSubset([
                        {first_name: 'Bob', last_name: 'SquarePants', nickname: 'SpongeBob'}
                    ])
                })
        });
    });
});
