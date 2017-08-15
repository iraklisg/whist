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
                return await gamesRepository.getAllGames();
            },

            /**
             * Finds all games with players (referenced value) populated
             * @returns {Promise}
             */
            async getAllGamesWithPlayers() {
                // exec() on find returns a Promise instead of the default callback
                return await gamesRepository.getAllGamesWithPlayers();
            },

            /**
             * Finds a game by id
             * @param {String} gameId
             * @returns {Promise}
             */
            async getGameById(gameId) {
                // exec() on find returns a Promise instead of the default callback
                return await gamesRepository.getGameById(gameId);
            },

            /**
             * Finds the last score of each player (the score each player had when the game was finished), given the game id
             * @param {String} gameId
             * @returns {Promise}
             */
            async getFinalScore(gameId) {
                try {
                    const gameWithPlayers = await Game.findOne({_id: gameId}).populate('players.player');
                    return gameWithPlayers.players.map(info => {
                        return {
                            player: info.player.nickname,
                            final: Number(info.points.slice(-1)),
                        }
                    });
                } catch (err) {
                    throw new Error(err);
                }
            },

            /**
             * Finds the winner(s) for a given game.
             * Returns an array of either one object (one winner) or two etc
             * [ { player: 'nick', final: 40 } ]
             * @param {String} gameId
             * @returns {Promise}
             */
            async getWinners(gameId) {
                try {
                    let scores = await this.getFinalScore(gameId);
                    let winners = [scores[0]];
                    for (let i=1; i < scores.length; i++) {
                        if (scores[i].final === winners[0].final) {
                            winners.push(scores[i]);
                        } else if (scores[i].final > winners[0].final) {
                            winners = [scores[i]];
                        }
                    }
                    return winners;
                } catch (err) {
                    throw new Error(err);
                }
            }

        });
};

module.exports.makeGamesService = makeGamesService;