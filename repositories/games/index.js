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
             * Get all games
             * @returns {Promise.<Mongoose.<Game>>}
             */
            async getAllGames() {
                return await Game.find({}).exec();
            },

            /**
             * Get a game by id
             * @param id - The game's id
             * @returns {Promise.<Mongoose.<Game>>}
             */
            async getById(id) {
                return await Game.findOne({_id: id}).exec();
            }
        });
};

module.exports.makeGamesRepository = makeGamesRepository;