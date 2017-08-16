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
                return await gamesRepository.getAll();
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
                return await gamesRepository.get(gameId);
            },

            /**
             * Gets the scores (an array) of each player, given the game id
             * [
             *   {player: <Player Model>, points: Array, order: Number},
             *   {player: <Player Model>, points: Array, order: Number},
             *   {player: <Player Model>, points: Array, order: Number}
             * ]
             * @param {String} gameId
             * @returns {Promise}
             */
            async getScoresWithPlayers(gameId) {
                try {
                    const gameWithPlayers = await gamesRepository.getGameWithPlayers(gameId);
                    return gameWithPlayers.players.map(info => {
                        return {
                            player: info.player,
                            points: info.points,
                            order: info.order,
                        }
                    });
                } catch (err) {
                    throw new Error(err);
                }
            },

            /**
             * Finds the last score of each player (the score each player had when the game was finished), given the game id
             * [
             *   {player: <Player Model>, final: Number, order: Number},
             *   {player: <Player Model>, final: Number, order: Number},
             *   {player: <Player Model>, final: Number, order: Number}
             * ]
             * @param {String} gameId
             * @returns {Promise}
             */
            async getFinalScores(gameId) {
                try {
                    const playersScores = await this.getScoresWithPlayers(gameId);
                    return playersScores.map(info => {
                        return {
                            player: info.player,
                            final: Number(info.points.slice(-1)),
                            order: info.order
                        }
                    });
                } catch (err) {
                    throw new Error(err);
                }
            },

            /**
             * Finds the winner(s) along with the/their final score, for a given game.
             * Returns an array of either one object (one winner) or two etc
             * [
             *   {player: <Player Model>, final: Number},
             *   {player: <Player Model>, final: Number},
             * ]
             * @param {String} gameId
             * @returns {Promise}
             */
            async getWinnersAndScores(gameId) {
                try {
                    let scores = await this.getFinalScores(gameId);
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
            },

        });
};

module.exports.makeGamesService = makeGamesService;