const Player = require('../models/Player');

/**
 * The players repository factory.
 * "repository" is a fancy term to descibe an object
 * that is used to retrieve data from a datasource - the actual
 * data source does not matter. Could be a database, a REST API,
 * or some IoT things like sensors or whatever.
 */

const makePlayersRepository = () => {
    /*
    Enter here any private properties we want to restrict access
    eg: const _private = 'secret'
    */
    // const _players = []; // in-memory implementation
    // const _Model = require(`../models/${modelName}`);

    return Object.assign(Object.create({

        /*
        These are added to factory's prototype
        */

        async getAll() {
            const players = await Player.find({}).exec();
            return players;
        },

        /**
         * Get a player by id.
         * @param id
         * @returns {Promise.<obj>} - The player of given id
         */
        async get (id) {
            // const player = _players.filter(player => player.id === id);
            const player = await Player.findById(id).exec();
            return player;
        },

        /**
         * Creates a new player.
         * @param data - The player properties
         * @returns {Promise.<obj>}
         */
        async create(data) {
            const newPlayer = await Player.create(data);
            return newPlayer;
        },

        /**
         * Updates a player.
         * @param id - The id of the player we want to create
         * @param data - The new data for this player
         * @returns {Promise.<obj>}
         */
        async update(id, data) {
            const updatedPlayer = await Player.findOneAndUpdate(id, {$set: data}, {new: true}).exec();
            return updatedPlayer
        }

    }), {

        /*
        These are added to the factory itself
        */

        /**
         * Get a player by nickname
         * @param nickname - The player's nickname
         * @returns {Promise.<obj>}
         */
        async getByNickname(nickname) {
            const player = await Player.findOne({nickname}).exec();
            return player;
        }
    });
};

module.exports.makePlayersRepository = makePlayersRepository;