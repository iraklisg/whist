/**
 * Game service module.
 * The service have access to data via various repositories
 * and make some work for the controllers
 * @depends gamesRepository
 * @module /services/games
 */

const assert = require('assert');
const _ = require('lodash');

const crudServices = require('../app/crud')('Game');  // the basic crud services for the Game model

// These are imported for extra services.....
const Game = require('../../models/Game/index');


const makeGamesService = (gamesRepository, commonServices) => {
    // Dependencies
    assert(gamesRepository, 'gamesRepository is required.');
    assert(commonServices, 'commonServices is required.');

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
                    for (let i = 1; i < scores.length; i++) {
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

            /**
             * Finds the ranking per player, for a given game.
             * Returns an array consisting of
             * [
             *   {player: <Player Model>, rank: Number, final: Number},
             *   {player: <Player Model>, rank: Number, final: Number},
             *   {player: <Player Model>, rank: Number, final: Number},
             * ]
             * @param {String} gameId
             * @returns {Promise}
             */
            async getRanking(gameId) {
                // Get scores and sort them by the final score in descending order (higher goes first)
                let scores = await this.getFinalScores(gameId);
                scores.sort((a, b) => b.final - a.final);

                // Extract only the ordered final scores (to do the math better)
                let finals = scores.map(score => {return score.final;});
                let rankings = [1],
                    s = finals[0],  // the first element in the Array is ALWAYS the #1 ranked player
                    i = 1;
                for (let final of finals.slice(1)) {  // start the iteration from the second element
                    if (final === s) {rankings.push(i);}
                    else {rankings.push(i + 1); i++;}
                    s = final;
                }
                return scores.map((score, i) => {
                    return {
                        player: score.player,
                        rank: rankings[i],
                        final: score.final,
                    }
                });
            }
        });
};

module.exports.makeGamesService = makeGamesService;


let u = [
    {
        player: {
            _id: '598ad7d3f5ef673497cb7a89',
            first_name: 'John',
            last_name: 'Lamprakos',
            nickname: 'john'
        },
        final: 36,
        order: 2
    },
    {
        player: {
            _id: '598ad7d3f5ef673497cb7a8a',
            first_name: 'Nick',
            last_name: 'Mavrakis',
            nickname: 'nick'
        },
        final: 36,
        order: 3
    },
    {
        player: {
            _id: '598ad7d3f5ef673497cb7a88',
            first_name: 'Iraklis',
            last_name: 'Georgas',
            nickname: 'ira'
        },
        final: 27,
        order: 1
    }
];