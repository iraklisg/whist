/**
 * User model module.
 * @module /models/User
 */

const mongoose = require('mongoose');

let plainStringType = {type: String, required: false};
let nicknameType = {type: String, match: /[\w-]+/, required: true, unique: true};

const playerSchema = mongoose.Schema({
    first_name: plainStringType,
    last_name: plainStringType,
    nickname: nicknameType,
});

const Player = mongoose.model('Player', playerSchema);

module.exports = Player;

// let players = [
//     new Player({
//         first_name: 'Nick',
//         last_name: 'Mavrakis',
//         nickname: 'nick'
//     }),
//     new Player({
//         first_name: 'John',
//         last_name: 'Lamprakos',
//         nickname: 'john'
//     }),
//     new Player({
//         first_name: 'Iraklis',
//         last_name: 'Georgas',
//         nickname: 'ira'
//     }),
// ];
//
// // Save them
// for (let player of players) {
//     player.save((err) => {
//         if (err) console.log(err);
//         // saved!
//     });
// }