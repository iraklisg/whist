const Player = require('../../models/Player/index');
const crudActions = require('../crud')('Player');

/**
 * The players repository factory.
 * "repository" is a fancy term to describe an object
 * that is used to retrieve data from a data source - the actual
 * data source does not matter. Could be a database, a REST API,
 * or some IoT things like sensors or whatever.
 */

const makePlayersRepository = () => {
    /*
    Enter here any private properties we want to restrict access
    eg: const _private = 'secret'
    */

    return Object.assign(
        // This is the factory's prototype
        Object.create(crudActions),

        {
            /**
             * Get a player by nickname
             * @param nickname - The player's nickname
             * @returns {Promise.<Mongoose.<Player>>}
             */
            async getByNickname(nickname) {
                const player = await Player.findOne({nickname}).exec();
                return player;
            }
        });
};

module.exports.makePlayersRepository = makePlayersRepository;