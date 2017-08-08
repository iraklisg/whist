/**
 * Player model module.
 * @module /models/Player
 */

const mongoose = require('mongoose');

const {validateNickname} = require('./validate');

let plainStringType = {type: String, required: false};
let nicknameType = {
    type: String, match: /[\w-]+/,
    required: [true, 'nickname is required.'],
    unique: true,
    //validate: [{ validator: validateNickname, msg: 'nickname "{VALUE}" already exists!'}],
};

const playerSchema = mongoose.Schema({
    first_name: plainStringType,
    last_name: plainStringType,
    nickname: nicknameType,
});

const Player = mongoose.model('Player', playerSchema);

module.exports = Player;