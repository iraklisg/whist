// Prepare testing database
const h = require('../testHelpers');
const ObjectId = require('mongoose').Types.ObjectId;
const Player = require('../../models/Player');
const Game = require('../../models/Game');

// Assertion library
const chai = require('chai');
chai.use(require('chai-subset'));
chai.use(require('chai-things'));
const expect = chai.expect;

// Entities under test
// const {makePlayersRepository} = require('../../repositories/players/index');
// const {makePlayersService} = require('../../services/players/index');
const {makeCommonServices} = require('../../services/app/common');
// const repository = makePlayersRepository();
const commonServices = makeCommonServices();
// const service = makePlayersService(repository, commonServices);


describe('PLAYERS service', () => {
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

    describe('#getScore', () => {
        it('should return the final score for a given player in a given game', async () => {
            const score = await commonServices.getScore(playerIds[0], gameIds[1]);

            expect(score).to.eql(39);
        });
    });

    describe('#getPoints', () => {
        it('should return the points array for a given player in a given game', async () => {
            const points = await commonServices.getPoints(playerIds[0], gameIds[1]);

            expect(points).to.eql([22, 21, 24, 22, 26, 25, 24, 27, 26, 25, 30, 33, 39, 37, 36, 35, 34, 36, 39]);
        });
    });

});