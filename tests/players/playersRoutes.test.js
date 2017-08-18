const chai = require('chai');
const chaiSubset = require('chai-subset');
const chaiThings = require('chai-things');
const request = require('supertest');
const cheerio = require('cheerio');
const ObjectId = require('mongoose').Types.ObjectId;

// Prepare testing database
const {app} = require('../../app');
const h = require('../testHelpers');
const Player = require('../../models/Player');
const Game = require('../../models/Game');

// Initialize chai assertion library
chai.use(chaiSubset);
chai.use(chaiThings);
const expect = chai.expect;

describe('PLAYER end-points', () => {
    const playerIds = [ObjectId(1), ObjectId(2), ObjectId(3)];
    const gameIds = [ObjectId(4), ObjectId(5), ObjectId(6)];

    /**
     * Connect to testing DB
     */
    before(() => h.connect('whist_testing'));

    /**
     * Repopulate the database
     */
    beforeEach(() => h.clear(Player)
        .then(() => Player.create([
            {_id: playerIds[0], first_name: 'Eugene', last_name: 'Krabs', nickname: 'Mr.Crabs'},
            {_id: playerIds[1], first_name: 'Bob', last_name: 'SquarePants', nickname: 'SpongeBob'},
            {_id: playerIds[2], first_name: 'Patric', last_name: 'Star', nickname: 'Patric'}
        ]))
        .then(() => h.clear(Game))
        .then(() => Game.create([
            {
                _id: gameIds[0],
                place: 'Milos',
                datetime: '2017-01-01',
                notes: 'Cool game',
                players: [
                    {
                        player: playerIds[0],
                        points: [19, 18, 21, 20, 24, 23, 22, 20, 19, 17, 15, 14, 18, 17, 24, 23, 26, 28, 27],
                        order: 1
                    },
                    {
                        player: playerIds[1],
                        points: [23, 26, 24, 28, 32, 36, 35, 34, 36, 32, 31, 30, 33, 32, 34, 37, 35, 33, 36],
                        order: 2
                    },
                    {
                        player: playerIds[2],
                        points: [22, 20, 19, 22, 21, 25, 24, 27, 23, 29, 35, 34, 33, 32, 31, 33, 35, 34, 36],
                        order: 3
                    }
                ]
            },
            {
                _id: gameIds[1],
                place: 'Gyzi',
                datetime: '2017-01-02',
                notes: 'Cool game',
                players: [
                    {
                        player: playerIds[0],
                        points: [22, 21, 24, 22, 26, 25, 24, 27, 26, 25, 30, 33, 39, 37, 36, 35, 34, 36, 39],
                        order: 1
                    },
                    {
                        player: playerIds[1],
                        points: [23, 26, 25, 27, 26, 24, 23, 22, 27, 26, 25, 28, 30, 32, 31, 33, 35, 33, 32],
                        order: 2
                    },
                    {
                        player: playerIds[2],
                        points: [19, 21, 23, 22, 25, 29, 28, 27, 30, 29, 27, 24, 23, 22, 21, 20, 23, 25, 24],
                        order: 3
                    }
                ]
            },
            {
                _id: gameIds[2],
                place: 'Peristeri',
                datetime: '2017-01-03',
                notes: 'Cool game',
                players: [
                    {
                        player: playerIds[0],
                        points: [19, 18, 17, 16, 19, 18, 21, 20, 19, 18, 23, 30, 28, 27, 32, 30, 32, 35, 34],
                        order: 1
                    },
                    {
                        player: playerIds[1],
                        points: [23, 26, 29, 35, 34, 37, 42, 44, 48, 46, 45, 44, 48, 50, 52, 51, 50, 49, 52],
                        order: 2
                    },
                    {
                        player: playerIds[2],
                        points: [22, 24, 26, 28, 31, 33, 32, 37, 40, 44, 51, 54, 53, 56, 55, 53, 58, 60, 62],
                        order: 3
                    }
                ]
            },
        ]))
        .then(() => Player.findByIdAndUpdate(playerIds[0], {$set: {games: gameIds}}))
        .then(() => Player.findByIdAndUpdate(playerIds[1], {$set: {games: gameIds}}))
        .then(() => Player.findByIdAndUpdate(playerIds[2], {$set: {games: gameIds}}))
    );

    /**
     * Disconnect from testing DB
     */
    after(() => h.disconnectAll());

    describe('GET /players', () => {
        it('should list all players', async () => {
            return request(app)
                .get('/players')
                .expect(200)
                .then(res => {
                    const $ = cheerio.load(res.text); // we load the whole rendered html responded by the server
                    const names = []; // an array that will hold all names
                    $('h4.title').each((i, elm) => names.push($(elm).text()));
                    expect(names).to.have.same.members(['Eugene Krabs', 'Bob SquarePants', 'Patric Star']);
                })
        });
    });

    describe('GET /players/:nickname', () => {
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
        it('should respond with the newly crated player', () => {
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
        it('should respond with the newly crated player', () => {
            const data = {first_name: 'Squidward', last_name: 'Tentacles', nickname: 'Squidward'};
            const url = `/players/${playerIds[0]}`;
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
