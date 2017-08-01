/**
 * Game model module.
 * @module /models/Game
 */

const mongoose = require('mongoose');

const gameSchema = mongoose.Schema({
    players: [
        {
            player: {type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true},
            points: {type: Array, required: true}
        }
    ],
    datetime: {type: Date},
    place: String,
    event: String,
    notes: String,
    // winner: { type: Schema.Types.ObjectId, ref: 'Player' },
    // player_order: [
    //     {type: mongoose.Schema.Types.ObjectId, ref: 'Player'}
    // ],
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;