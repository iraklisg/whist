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