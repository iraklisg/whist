const chai = require('chai');
const ObjectId = require('mongoose').Types.ObjectId;

const h = require('../testHelpers');
const {makePlayersRepository} = require('../../repositories/playersRepository'); // this is a factory
const Player = require('../../models/Player');

chai.use(require('chai-subset'));
const expect = chai.expect;

describe('PLAYER Repository', () => {
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

    describe('#getAll', () => {
        it('should return all players', async () => {
            const repo = makePlayersRepository();

            const players = await repo.getAll();

            expect(players).to.containSubset([
                {_id: ids[0], first_name: 'Eugene', last_name: 'Krabs', nickname: 'Mr.Crabs'},
                {_id: ids[1], first_name: 'Bob', last_name: 'SquarePants', nickname: 'SpongeBob'},
                {_id: ids[2], first_name: 'Patric', last_name: 'Star', nickname: 'Patric'}
            ])
        });
    });

    describe('#get', () => {
        it('should return a player with given id', async () => {
            const repo = makePlayersRepository();

            const existedPlayer = await Player.findById(ids[0]).exec();

            const player = await repo.get(existedPlayer.id);

            expect(player).to.deep.include(existedPlayer)

        });
    });

    describe('#create', () => {
        it('should create a new user in database and return it', async () => {
            const repo = makePlayersRepository();
            const data = {first_name: 'Squidward', last_name: 'Tentacles', nickname: 'Squidward'};

            const newPlayer = await repo.create(data);

            expect(newPlayer).to.deep.include(data);

            const players = await Player.find({}).exec();

            expect(players).to.have.lengthOf(4);
        });
    });

    describe('#update', () => {
        it('should find and update an existed player, then return the updated player', async () => {
            const repo = makePlayersRepository();
            const existedPlayer = await Player.find(ids[2]).exec(); //id:2 = Patric
            const data = {first_name: 'Squidward', last_name: 'Tentacles', nickname: 'Squidward'};

            const updatedPlayer = await repo.update(existedPlayer.id, data);

            expect(updatedPlayer).to.include(data);

            const players = await Player.find({}).exec();

            expect(players).to.have.lengthOf(3);

        });
    });

    describe('#getByNickname', () => {
        it('should find and return the player of given nickname', async () => {
            const repo = makePlayersRepository();

            const player = await repo.getByNickname('Mr.Crabs');

            expect(player).to.deep.include({first_name: 'Eugene', last_name: 'Krabs', nickname: 'Mr.Crabs'});
        });
    });
});