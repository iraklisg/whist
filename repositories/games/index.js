const Game = require('../../models/Game/index');
const crudActions = require('../crud')('Game');

/**
 * The games repository factory.
 * "repository" is a fancy term to describe an object
 * that is used to retrieve data from a data source - the actual
 * data source does not matter. Could be a database, a REST API,
 * or some IoT things like sensors or whatever.
 */

const makeGamesRepository = () => {
    /*
    Enter here any private properties we want to restrict access
    eg: const _private = 'secret'
    */

    return Object.assign(
        // This is the factory's prototype
        Object.create(crudActions),

        {
            /**
             * Get all games with players (referenced value) populated
             * @returns {Promise.<Mongoose.<Game>>}
             */
            async getAllGamesWithPlayers() {
                return await Game.find({}).populate('players.player').exec();
            },

            /**
             * Get a game by id, with players attached (populated)
             * @param gameId - The game's id
             * @returns {Promise.<Mongoose.<Game>>}
             */
            async getGameWithPlayers(gameId) {
                return await Game.findOne({_id: gameId}).populate('players.player').exec();
            },

        });
};

module.exports.makeGamesRepository = makeGamesRepository;