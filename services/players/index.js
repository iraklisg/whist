/**
 * Player service module.
 * The service have access to data via various repositories
 * and make some work for the controllers
 * @depends playersRepository
 * @module /services/player
 */
const assert = require('assert');
const _ = require('lodash');
const crudServices = require('../crud')('Player'); // the basic crud services for the Player model

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
             * Get all scores per game for a given player
             * @param {Mongoose.<Player>} player - The player model
             * @returns {Promise.<Array>} - An array of all player's final scores
             */
            async getScores(player) {

                /** [ ℹ ] *********************************************************
                 * IMPORTANT NOTE:
                 * We avoid calling `populate()` directly on `player` model argument,
                 * because in this case the model (which is passed by reference)
                 * will be also populated. Therefore we use the player repository
                 * to await for a new player model and populate it
                 *****************************************************************/

                const newPlayer = await playersRepository.getByNickname(player.nickname);
                const pPlayer = await newPlayer.populate('games').execPopulate();
                const games = pPlayer.games;
                let scores = [];
                for (let game of games) {
                    let place = game.place;
                    let date = game.datetime;
                    let score = await this.getScore(player, game);
                    scores.push({place, date, score});
                }
                return scores;
            },

            /**
             * Return the final score of a player for a given game
             * @param {Mongoose.<Player>} player - The player model
             * @param {Mongoose.<Game>} game - The game model TODO: get this from games repository
             * @returns {Promise.<Number>} - The player's final score for this game
             */
            async getScore(player, game) {
                const populatedGame = await game.populate('players.player').execPopulate();
                return populatedGame.players
                    .filter(playerInfo => playerInfo.player.nickname === player.nickname)
                    .reduce((acc, playerInfo) => {
                        acc = playerInfo.points.slice(-1)[0];
                        return acc;
                    }, 0)
            },

            /**
             * Find a player's victory with the highest score
             * @player {Mongoose.<Player>} - The player
             * @games {Mongoose.Collection} - The collection of all games
             * @returns {Number} - The highest victory
             */
            async getHighestScore(player) {
                const scoresTable = await this.getScores(player);
                let scores = scoresTable.map(score => score.score);
                return _.max(scores)
            },
        });
};

module.exports.makePlayersService = makePlayersService;