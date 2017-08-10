const request = require('supertest');
const chai = require('chai');
const ObjectId = require('mongoose').Types.ObjectId;

const h = require('../testHelpers');
const {app} = require('../../app');
const Player = require('../../models/Player');

chai.use(require('chai-subset'));
const expect = chai.expect;

describe('PLAYER end-points', () => {

    const ids = [ObjectId(1), ObjectId(2), ObjectId(3)];
    /**
     * Connect to testing DB
     */
    before(() => {
        return h.connect('whist_testing');
    });

    /**
     * Clear the given collection
     */
    beforeEach(() => {
        return h.clear(Player)
            .then(() => Player.create([
                {_id: ids[0], first_name: 'Eugene', last_name: 'Krabs', nickname: 'Mr.Crabs'},
                {_id: ids[1], first_name: 'Bob', last_name: 'SquarePants', nickname: 'SpongeBob'},
                {_id: ids[2], first_name: 'Patric', last_name: 'Star', nickname: 'Patric'}
            ]))
    });

    /**
     * Disconnect from testing DB
     */
    after(() => {
        return h.disconnectAll();
    });

    describe('GET /players', () => {
        it('should list all players', async () => {
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

    describe('GET /players/:nickname', async () => {
        it('should show the player with nickname', () => {
            return request(app)
                .get('/players/SpongeBob')
                .expect(200)
                .then(res => {
                    expect(res.body).to.include({first_name: 'Bob', last_name: 'SquarePants', nickname: 'SpongeBob'})
                })
        });
    });

    describe('POST /players', () => {
        it('should respond with the newly crated player', async () => {
            const data = {first_name: 'Squidward', last_name: 'Tentacles', nickname: 'Squidward'};
            return request(app)
                .post('/players')
                .send(data)
                .expect(200)
                .then(res => {
                    expect(res.body).to.include(data)
                })
        });
    });

    describe('PUT /players/:id', () => {
        it('should respond with the newly crated player', async () => {
            const data = {first_name: 'Squidward', last_name: 'Tentacles', nickname: 'Squidward'};
            const url = `/players/${ids[0]}`;
            return request(app)
                .put(url) // {_id: ids[0], first_name: 'Eugene', last_name: 'Krabs', nickname: 'Mr.Crabs'},
                .send(data)
                .expect(200)
                .then(res => {
                    expect(res.body).to.include(data)
                })
        });
    });
});
