/**
 * Generic factory that returns an object that contains common actions (functions) for the Whist app.
 * @returns {*}
 */


const makeCommonServices = () => {

    const {makeGamesRepository} = require('../../repositories/games');
    const gameRepo = makeGamesRepository();

    return {
        /**
         * Return the final score of a player for a given game.
         * @param {Mongoose.<Player>} playerId - The player's id
         * @param {Mongoose.<Game>} gameId - The game's id
         * @returns {Promise.<Number>} - The player's final score for this game
         */
        async getScore(playerId, gameId) {
            const game = await gameRepo.get(gameId);
            const populatedGame = await game.populate('players.player').execPopulate();
            return populatedGame.players
                .filter(playerInfo => playerInfo.player.id === playerId.toString())
                .reduce((acc, playerInfo) => {
                    acc = playerInfo.points.slice(-1)[0];
                    return acc;
                }, 0)
        },
    }
};

module.exports.makeCommonServices = makeCommonServices;
