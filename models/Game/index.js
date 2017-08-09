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

const getLastScore = async (gameObj) => {
    try {
        const game = await Game.findOne({_id: gameObj.id})
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
};


/**
  From mongoose official docs:
  "Do not declare methods using ES6 arrow functions (=>). Arrow functions explicitly prevent binding "this",
  so your method will not have access to the document and the above examples will not work."
 */
// Custom methods
gameSchema.virtual('winners').get(async function() {
    try {
        let scores = await getLastScore(this);
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
});


// Model definition
const Game = mongoose.model('Game', gameSchema);


module.exports = Game;