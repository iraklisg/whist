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
const {makePlayersRepository} = require('../../repositories/players/index');
const {makePlayersService} = require('../../services/players/index');
const {makeCommonServices} = require('../../services/app/common');
const repository = makePlayersRepository();
const commonServices = makeCommonServices();
const service = makePlayersService(repository, commonServices);


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
                        points: [23, 26, 29, 35, 34, 37, 42, 44, 48, 46, 45, 44, 48, 50, 53, 51, 50, 49, 52],
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

    describe('#getScores', () => {
        it('should return the given player final scores', async () => {
            const bob = {nickname: 'SpongeBob', id: playerIds[1]}; // mock the player
            const scores = await service.getScores(bob);

            // TODO: work a little bit more on dates
            expect(scores).to.containSubset([
                {place: 'Milos', score: 36},
                {place: 'Gyzi', score: 32},
                {place: 'Peristeri', score: 52}
            ])
        });
    });

    describe('#getHighestScore', () => {
        it('return an array all player rankings', async () => {
            const bob = await repository.getByNickname('SpongeBob');
            const highScore = await service.getHighestScore(bob);

            expect(highScore).to.be.a('number').that.equals(52);
        });
    });

    describe('#getLowestScore', () => {
        it('return an array all player rankings', async () => {
            const bob = await repository.getByNickname('SpongeBob');
            const highScore = await service.getLowestScore(bob);

            expect(highScore).to.be.a('number').that.equals(32);
        });
    });

    describe('#getAverageScore', () => {
        it('should return the average score of a player', async () => {
            const avgScore = await service.getAverageScore(await repository.getByNickname('SpongeBob'));

            console.log(avgScore);

            expect(avgScore).to.be.a('number').that.equals(40);
        });
    });

    describe('#getPoints', () => {
        it('should return all points of a player', async () => {
            const bob = await repository.getByNickname('SpongeBob');
            const points = await service.getPoints(bob);

            expect(points).to.containSubset([
                {place: 'Milos', points: [23, 26, 24, 28, 32, 36, 35, 34, 36, 32, 31, 30, 33, 32, 34, 37, 35, 33, 36]},
                {place: 'Gyzi', points: [23, 26, 25, 27, 26, 24, 23, 22, 27, 26, 25, 28, 30, 32, 31, 33, 35, 33, 32]},
                {place: 'Peristeri', points: [23, 26, 29, 35, 34, 37, 42, 44, 48, 46, 45, 44, 48, 50, 53, 51, 50, 49, 52]}
            ])
        });
    });

    describe('#getHighestPoint', () => {
        it('should return the highest point achieved by a player, at some point, in all games', async () => {
            const highScore = await service.getHighestPoint(await repository.getByNickname('SpongeBob'));

            expect(highScore).to.be.a('number').that.equals(53);
        });
    });

    describe('#getLowestPoint', () => {
        it('should return the lowest point scored by a player, at some point, in all games', async () => {
            const highScore = await service.getLowestPoint(await repository.getByNickname('SpongeBob'));

            expect(highScore).to.be.a('number').that.equals(22);
        });
    });

    describe('#getRankings', () => {
        it('should return an array with player rankings per game', async () => {
            const bob = await repository.getByNickname('SpongeBob');
            const rankings = await service.getRankings(bob);

            expect(rankings).to.have.lengthOf(3).and.to.containSubset([
                {place: 'Milos', rank: 1},
                {place: 'Gyzi', rank: 2},
                {place: 'Peristeri', rank: 2},
            ]);
        });
    });

    describe('#getAggregatedRankings', () => {
        it('should return an array with the player aggregated rankings', async () => {
            const bob = await repository.getByNickname('SpongeBob');
            const rankings = await service.getAggregatedRankings(bob);

            expect(rankings).to.eql({
                first: 1,
                second: 2,
                third: 0
            });
        });
    });


});