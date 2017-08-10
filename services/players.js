/**
 * Player service module.
 * The service have access to data via various repositories
 * and make some work for the controllers
 * @depends playersRepository
 * @module /services/player
 */
const assert = require('assert');


const Game = require('../models/Game');
const gamesService = require('../services/games');

// const {makePlayersRepository} = require('../repositories/playersRepository'); // this is a factory

// const playersRepository = makePlayersRepository();


const makePlayersService = (playersRepository) => {
    assert(playersRepository, 'playersRepository is required.'); // Its a dependency

    return Object.assign(Object.create({
        /*
        These are added to factory's prototype
        */

        /**
         * Returns all players
         * @returns {Promise}
         */
        async getAll() {
            return playersRepository.getAll();
        },

        /**
         * Returns all players
         * @param {String} id - The player's ObjectId string representation
         * @returns {Promise}
         */
        async get(id) {
            return playersRepository.get(id);
        },

        /**
         * Saves a new player to database
         * @param {Object} data
         * @returns {Promise}
         */
        async create(data) {
            return playersRepository.create(data);
        },

        /**P
         * Update an existing player
         * @param id
         * @param data
         * @returns {Promise}
         */
        async update(id, data) {
            return playersRepository.update(id, data)
        },

    }), {
        /*
        These are added directly to factory instances
        */

        /**
         * Finds a player by nickname
         * @param {String} nickname
         * @returns {Promise}
         */
        async getByNickname(nickname) {
            // exec() on find returns a Promise instead of the default callback
            return playersRepository.getByNickname(nickname);
        },

        /**
         * Find the highest final score achieved by the player
         */
        async getHighestScore(player) {
            // TODO get only the games for this player
            const games = await Game.find({})
                .populate('players.player')
                .exec();

            return await Promise.all(games.map(async (game) => {
                return await gamesService.getRanking(game.id); // SOS https://stackoverflow.com/questions/36992590/asynchronous-map-function-that-awaits-returns-promise-instead-of-value
            }));
        },

        /**
         * Find the highest score that a user has achieved so far
         * @param person
         */
        async highestScores(person) {
            try {
                const games = await Game.find({}).populate('players.player').exec();

                return games.reduce((acc, game) => {
                    acc.push(game.players
                        .filter(player => player.player.id === person[0].id)
                        .reduce((acc, player) => {
                            acc = player.points;
                            return acc;
                        }, '')
                    );
                    return acc;
                }, []);

            } catch (err) {
                throw new Error(err);
            }
        }

    });
};

module.exports.makePlayersService = makePlayersService;