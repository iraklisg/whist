const chai = require('chai');
const h = require('../testHelpers');

chai.use(require('chai-subset'));
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
            const games = await Game.find({}).populate('players.player').exec();

            const rankings = await service.getScores(ira, games);
            console.log(rankings)
        });
    });
});