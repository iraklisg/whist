/**
 * Game service module.
 * @module /services/games
 */

const Game = require('../models/Game');


const gameService = {

    /**
     * Returns all games
     * @returns {Promise}
     */
    async getAllGames() {
        let g = await Game.find().limit(1).exec();
        g = new Game(g[0]);
        console.log(await g.winners);
        // console.log(g.toObject({virtuals: true}));
        return g;
        // return Game.find().limit(1).exec();
    },

    /**
     * Finds a game by id
     * @param {String} id
     * @returns {Promise}
     */
    getGameById(id) {
        // exec() on find returns a Promise instead of the default callback
        return Game.findOne({_id: id}).exec(); // possible bug on findById https://github.com/Automattic/mongoose/issues/4867
    },

    /**
     * Saves a new game to database
     * @param {Object} data
     * @returns {Promise} - Either fulfilled with new game or rejected with error
     */
    saveGame(data) {
        return Game({id: data.id}).save();
    },

    /**
     * Update an existing game
     * @param id
     * @param data
     * @returns {Promise}
     */
    updateGame(id, data) {
        return Game.findOneAndUpdate(id, {$set: data}, {new: true}).exec();
    },

    /**
     * Get the last score of each player for a game.
     * @param {String} gameId - The game id
     * @returns {Promise<Array>} // Because it's an async function ;-)
     */
    async getLastScore(gameId) {
        try {
            const game = await Game.findOne({_id: gameId})
                .populate('players.player')
                .exec();  // returns a promise, so I await

            return game.players.map(info => {
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
     * Get the winner(s) of a game.
     * @param {String} gameId - The game id
     * @returns {Promise<Array>} // Because it's an async function ;-)
     */
    async getWinners(gameId) {
        try {
            let scores = await module.exports.getLastScore(gameId);
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
};

module.exports = gameService;