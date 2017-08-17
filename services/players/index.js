/**
 * Player service module.
 * The service have access to data via various repositories
 * and make some work for the controllers
 * @depends playersRepository
 * @module /services/player
 */
const assert = require('assert');
const _ = require('lodash');

const crudServices = require('../app/crud')('Player');  // the basic crud services for the Player model


const makePlayersService = (playersRepository, commonServices) => {
    assert(playersRepository, 'playersRepository is required.');  // Its a dependency
    assert(commonServices, 'commonServices is required.');  // Its a dependency

    return Object.assign(
        Object.create(crudServices),  // crudServices are in the players service prototype
        {
            /**
             * Finds a player by nickname
             * @param {String} nickname
             * @returns {Promise.<Mongoose.<Player>>}
             */
            async getByNickname(nickname) {
                return playersRepository.getByNickname(nickname);
            },

            /**
             * Get all final scores per game for a given player.
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
                    let score = await commonServices.getScore(player.id, game.id);
                    scores.push({place, date, score});
                }
                return scores;
            },

            /**
             * Get the highest final score achieved by a player (either victorious or not).
             * @param {Mongoose.<Player>} player
             * @returns {Promise.<Number>} - The highest final score
             */
            async getHighestScore(player) {
                const scoresTable = await this.getScores(player);
                let scores = scoresTable.map(score => score.score);
                return _.max(scores);
            },

            /**
             * Get the lowest final score achieved by a player (either victorious or not).
             * @param {Mongoose.<Player>} player
             * @returns {Promise.<Number>} - The highest final score
             */
            async getLowestScore(player) {
                const scoresTable = await this.getScores(player);
                let scores = scoresTable.map(score => score.score);
                return _.min(scores);
            },

            /**
             * Get the average final score of a player.
             * @param {Mongoose.<Player>} player
             * @returns {Promise.<Number>}
             */
            async getAverageScore(player) {
                const scoresTable = await this.getScores(player);
                let scores = scoresTable.map(score => score.score);
                return Math.round(_.mean(scores));
            },

            /**
             * Get all points achieved by a player in all games
             * @param {Model} player
             * @returns {Promise.<Array<number>>}
             */
            async getPoints(player) {
                const newPlayer = await playersRepository.getByNickname(player.nickname);
                const pPlayer = await newPlayer.populate('games').execPopulate();
                const allPoints = [];
                for (let game of pPlayer.games) {
                    allPoints.push({
                        place: game.place,
                        date: game.datetime,
                        points: await commonServices.getPoints(player.id, game.id)
                    });
                }
                return allPoints;
            },

            /**
             * Get the highest point ever achieved by a player
             * @param {Model} player
             * @returns {Promise.<number>}
             */
            async getHighestPoint(player) {
                const allPoints = await this.getPoints(player);
                const highestPoints = allPoints.map(pointsInfo => _.max(pointsInfo.points));
                return _.max(highestPoints);
            },

            /**
             * Get the lowest point ever achieved by a player
             * @param {Model} player
             * @returns {Promise.<number>}
             */
            async getLowestPoint(player) {
                const allPoints = await this.getPoints(player);
                const highestPoints = allPoints.map(pointsInfo => _.min(pointsInfo.points));
                return _.min(highestPoints);
            },


            /**
             * TODO consider combine it with games service by extracting common logic getranking(game, player)
             * Get all the rankings of a player
             * @param player
             * @returns {Promise<Array>}
             */
            async getRankings(player) {
                const newPlayer = await playersRepository.getByNickname(player.nickname);
                const pPlayer = await newPlayer.populate('games').execPopulate();
                const games = pPlayer.games;

                const rankings = [];

                for (let game of games) {
                    // find the final score achieved by each player of this game
                    let scores = game.players.map(info => {
                        return {
                            playerId: info.player,
                            score: info.points.slice(-1)[0]
                        }
                    });

                    // Sort the player scores in acceding order to find the ranking
                    let ranking = scores.sort((a, b) => a.score - b.score); // https://stackoverflow.com/a/979289/2235814

                    // UGLY HACK: check for ties
                    let tie = false;
                    if (ranking[2].score === ranking[1].score) tie = true;

                    // Calculate the player's rank by comparing his score with other players' scores
                    let rank = 0
                        , normalizedIndex = 0;

                    ranking.forEach((item, index) => {
                        if (item.playerId.toString() === player.id) {
                            normalizedIndex = tie ? index + 1 : index;
                            switch (normalizedIndex) {
                                case 0:
                                    rank = 3;
                                    break;
                                case 1:
                                    rank = 2;
                                    break;
                                case 2:
                                    rank = 1;
                                    break;
                                case 3:
                                    rank = 1;
                                    break;
                            }
                        }
                    });

                    // Push the rank info for this game
                    rankings.push({
                        gameId: game.id,
                        place: game.place,
                        date: game.datetime,
                        rank: rank
                    })
                }
                return rankings
            },

            /**
             * Get the aggregated rankings of a player
             * @param player
             * @returns {Promise.<{first: Number, second: Number, third: Number}>}
             */
            async getAggregatedRankings(player) {
                const rankings = await this.getRankings(player);

                return {
                    first: _.filter(rankings, rank => rank.rank === 1).length,
                    second: _.filter(rankings, rank => rank.rank === 2).length,
                    third: _.filter(rankings, rank => rank.rank === 3).length
                }
            }

        });
};

module.exports.makePlayersService = makePlayersService;