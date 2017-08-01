/**
 * Player model module.
 * @module /models/Player
 */

const mongoose = require('mongoose');

const {validateNickname}  = require('./validate');



let plainStringType = {type: String, required: false};
let nicknameType = {
    type: String, match: /[\w-]+/,
    required: [true, 'nickname is required.'],
    //validate: [{ validator: validateNickname, msg: 'nickname "{VALUE}" already exists!'}],
};

const playerSchema = mongoose.Schema({
    first_name: plainStringType,
    last_name: plainStringType,
    nickname: nicknameType,
});

const Player = mongoose.model('Player', playerSchema);

// Player.schema.path('nickname').validate(function (value, respond) {
//     Player.findOne({nickname: value}).count(function (err, result) {
//         if (result > 0) respond(false);
//         respond(true);
//     });
// }, 'This email address is already registered');

// let p1 = new Player({first_name: 'Test 1', last_name: 'Test 2', nickname: 'xxx'});
// p1.save((err) => {
//     if (err) console.error(err);
// });
// let p2 = new Player({first_name: 'Test 3', last_name: 'Test 4', nickname: 'xxx'});
// p2.save(function (err) {
//     if (err) throw err;
// });




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
//     new Player({
//         first_name: 'Iraklis 2',
//         last_name: 'Georgas 2',
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

module.exports = Player;