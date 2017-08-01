/*
For Using ES6 modules see https://stackoverflow.com/questions/42645548/using-import-in-nodejs-server
*/
const express = require('express');
const mongoose = require('mongoose');
const nunjucks = require('nunjucks');

const routes = require('./routes');
const configServer = require('./config/server');
const configDB = require('./config/database');

// Create a new express app
const app = express();

// Set up mongoose connection (see http://mongoosejs.com/docs/connections.html#use-mongo-client)
mongoose.connect(configDB.url);

// Schema Types
let plainStringType = {type: String, required: false};
let nicknameType = {type: String, match: /[\w-]+/, required: true, unique: true};

// Schema definitions
const playerSchema = mongoose.Schema({
    first_name: plainStringType,
    last_name: plainStringType,
    nickname: nicknameType,
});

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

// Model definition. Mongoose automatically looks for the lowercase plural version of the model name
// In this case it looks for the 'players' collection
let Player = mongoose.model('Player', playerSchema);
let Game = mongoose.model('Game', gameSchema);

// Create a 'Player' document to the 'players' collection of the 'whist' database
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


// });

// Template engine configuration
nunjucks.configure('templates', {
    autoescape: true,
    express: app
});

// End points ????
app.get('/', (req, res) => {
    Player.find().exec(function(err, players){
        if (err) throw err;
        res.render('index.html', {players: players});
    });
});

app.get('/hello', (req, res) => res.send('Hello motherfuckers!!!'));
app.use('/foo', routes); // console.log "Hello" when visiting example.com/foo/users/foobar

app.listen(configServer.port, () => console.log('Example app listening on port 3000!'));
