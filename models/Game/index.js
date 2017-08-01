/**
 * Game model module.
 * @module /models/Game
 */

const mongoose = require('mongoose');

const gameSchema = mongoose.Schema({
    place: String,
    event: String,
    datetime: {type: Date},
    notes: String,
    order: Array,
    players: [
        {
            player: {type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true},
            points: {type: Array, required: true},
        }
    ],
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;