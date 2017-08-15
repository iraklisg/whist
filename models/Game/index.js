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

// Model definition
const Game = mongoose.model('Game', gameSchema);


module.exports = Game;