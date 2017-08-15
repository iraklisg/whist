/**
 * Game service module.
 * The service have access to data via various repositories
 * and make some work for the controllers
 * @depends gamesRepository
 * @module /services/games
 */
const assert = require('assert');
const _ = require('lodash');

const crudServices = require('../crud')('Game'); // the basic crud services for the Game model
// These are imported for extra services.....
const Game = require('../../models/Game/index');


const makeGamesService = (gamesRepository) => {
    assert(gamesRepository, 'gamesRepository is required.');  // It's a dependency

    return Object.assign(
        // This is the object's prototype
        Object.create(crudServices),
        {
            /**
             * Finds all games
             * @returns {Promise}
             */
            async getAllGames() {
                // exec() on find returns a Promise instead of the default callback
                return gamesRepository.getAllGames();
            },

            /**
             * Finds a game by id
             * @param {String} id
             * @returns {Promise}
             */
            async getGameById(id) {
                // exec() on find returns a Promise instead of the default callback
                return gamesRepository.getById(id);
            },

        });
};

module.exports.makeGamesService = makeGamesService;