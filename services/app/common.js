/**
 * Generic factory that returns an object that contains common actions (functions) for the Whist app.
 * @returns {*}
 */


const makeCommonServices = () => {

    const {makeGamesRepository} = require('../../repositories/games');
    const gameRepo = makeGamesRepository();

    return {

        /**
         * Return the points array of a player for a given game
         * @param playerId
         * @param gameId
         * @returns {Promise.<Array<number>>}
         */
        async getPoints(playerId, gameId) {
            const game = await gameRepo.get(gameId);
            return game.players.filter(playerInfo => playerInfo.player.toString() === playerId.toString())[0].points
        },

        /**
         * Return the final score of a player for a given game.
         * @param playerId
         * @param gameId
         * @returns {Promise.<Number>} - The player's final score for this game
         */
        async getScore(playerId, gameId) {
            const points = await this.getPoints(playerId, gameId);
            return points.slice(-1)[0]
        }
    }
};

module.exports.makeCommonServices = makeCommonServices;
