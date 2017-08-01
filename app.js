/*
For Using ES6 modules see https://stackoverflow.com/questions/42645548/using-import-in-nodejs-server
*/
const express = require('express');
const mongoose = require('mongoose');
const nunjucks = require('nunjucks');

const userRoutes = require('./routes/users');
const configServer = require('./config/server');
const configDB = require('./config/database');
const seedUsers = require('./controllers/seedController');
const Player = require('./models/Player');
const Game = require('./models/Game');

// Create a new express app
const app = express();

// Set up mongoose connection (see http://mongoosejs.com/docs/connections.html#use-mongo-client)
mongoose.connect(configDB.url);

// Template engine configuration
nunjucks.configure('views', {
    autoescape: true,
    express: app
});

/************************************************************
 * End points
 ************************************************************/

//Seed database
seedUsers(app);

app.get('/', (req, res) => {
    Player.find().exec(function(err, players){
        if (err) throw new Error(err);
        res.render('index.html', {players: players});
    });
});

app.use('/users', userRoutes); // console.log "Hello" when visiting example.com/foo/users/foobar

// Server is listening
app.listen(configServer.port, () => console.log('Example app listening on port 3000!'));
