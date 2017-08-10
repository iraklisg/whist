/**
 * Player service module.
 * The service have access to data via various repositories
 * and make some work for the controllers
 * @depends playersRepository
 * @module /services/player
 */
const assert = require('assert');
const crudServices = require('../crud')('Player'); // the basic crud services for the Player model

// These are imported for extra services.....
const Game = require('../../models/Game/index');
const gamesService = require('../games');


const makePlayersService = (playersRepository) => {
    assert(playersRepository, 'playersRepository is required.'); // Its a dependency

    /**
     * TODO move it to games service
     * Return the final score of a player for a given game
     * @param id - The game id
     * @param playerNickname
     * @returns {Promise.<*>}
     */
    const getPlayerScore = async (id, playerNickname) => {
        const game = await Game.findById(id).populate('players.player').exec();
        return game.players
            .filter(player => player.player.nickname === playerNickname)
            .reduce((acc, player) => {
                acc = player.points.slice(-1)[0];
                return acc;
            }, '')
    };


    return Object.assign(
        // This is the object's prototype
        Object.create(crudServices),
        {
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
             * Find the highest score that a user has achieved so far
             * @param person
             * @param games
             */
            async getScores(person, games) {
                try {
                    let scores = [];
                    for (let game of games) {
                        let place = game.place;
                        let date = game.datetime;
                        let score = await getPlayerScore(game.id, person.nickname);
                        scores.push({place, date, score});
                    }
                    return scores;
                } catch (err) {
                    throw new Error(err);
                }
            }

            // /**
            //  * Find the highest final score achieved by the player
            //  */
            // async getHighestScore(player) {
            //     // TODO get only the games for this player
            //     const games = await Game.find({})
            //         .populate('players.player')
            //         .exec();
            //
            //     return await Promise.all(games.map(async (game) => {
            //         return await gamesService.getRanking(game.id); // SOS https://stackoverflow.com/questions/36992590/asynchronous-map-function-that-awaits-returns-promise-instead-of-value
            //     }));
            // },
        });
};

module.exports.makePlayersService = makePlayersService;