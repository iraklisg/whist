/**
 * Game model module.
 * @module /models/Game
 */

const mongoose = require('mongoose');


// Schema definition
const gameSchema = mongoose.Schema({
    place: String,
    datetime: Date,
    notes: String,
    players: [
        {
            player: {type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true},
            points: {type: Array, required: true},
            order: {type: Number, required: true},
        }
    ],
});

const getLastScore = gameObj => {
    try {
        return gameObj.populate('players.player').execPopulate().then((game, err) => {
            return game.players.map(info => {
                return {
                    player: info.player.nickname,
                    final: Number(info.points.slice(-1)),
                }
            });
        });
    } catch (err) {
        throw new Error(err);
    }
};

const getWinners = async gameObj => {
    try {
        let scores = await getLastScore(gameObj);
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
};


/**
  From mongoose official docs:
  "Do not declare methods using ES6 arrow functions (=>). Arrow functions explicitly prevent binding "this",
  so your method will not have access to the document and the above examples will not work."
 */
// Custom methods
gameSchema.methods.winners = function() {
    // "this" is the game object model where this method
    // was called on, i.e g.winners()  <-- "this" is the g
    return getWinners(this)
};


// Model definition
const Game = mongoose.model('Game', gameSchema);


module.exports = Game;