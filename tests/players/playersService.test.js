const chai = require('chai');
const h = require('../testHelpers');

const Player = require('../../models/Player')

chai.use(require('chai-subset'));
chai.use(require('chai-things'));
const expect = chai.expect;

const Game = require('../../models/Game');
const {makePlayersRepository} = require('../../repositories/players/index');
const {makePlayersService} = require('../../services/players/index');

const repository = makePlayersRepository();
const service = makePlayersService(repository);


describe('PLAYERS service', () => {
    /**
     * Connect to testing DB
     */
    before(() => {
        return h.connect('whist');
    });

    // /**
    //  * Clear the given collection
    //  */
    // beforeEach(() => {
    //     return h.clear(Player)
    //         .then(() => Player.create([
    //             {_id: ids[0], first_name: 'Eugene', last_name: 'Krabs', nickname: 'Mr.Crabs'},
    //             {_id: ids[1], first_name: 'Bob', last_name: 'SquarePants', nickname: 'SpongeBob'},
    //             {_id: ids[2], first_name: 'Patric', last_name: 'Star', nickname: 'Patric'}
    //         ]))
    // });

    /**
     * Disconnect from testing DB
     */
    after(() => {
        return h.disconnectAll();
    });

    describe('#getScores', () => {
        it('return an array all player rankings', async () => {
            const ira = await repository.getByNickname('ira');
            const games = await Game.find({}).populate('players.player').exec(); // should take this from a repo

            const scores = await service.getScores(ira, games);

            expect(scores).to.have.lengthOf(games.length);
            expect(scores).to.all.have.property('place');
            expect(scores).to.all.have.property('date');
            expect(scores).to.all.have.property('score');
        });
    });

    describe('#getScore', () => {
        it('return the final score of player fot this game', async () => {
            const ira = await repository.getByNickname('ira');
            const games = await Game.findOne().exec(); // should take this from a repo

            const score = await service.getScore(ira, games);

            expect(score).to.be.a('number');
        });
    });
    describe('#getHighestScore', () => {
        it('return an array all player rankings', async () => {
            const ira = await repository.getByNickname('john');
            const games = await Game.find({}).populate('players.player').exec(); // should take this from a repo

            const highScore = await service.getHighestScore(ira, games);

            expect(highScore).to.be.a('number');
        });
    });


});