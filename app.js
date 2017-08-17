/*
For Using ES6 modules see https://stackoverflow.com/questions/42645548/using-import-in-nodejs-server
*/
const express = require('express');
const mongoose = require('mongoose');
const nunjucks = require('nunjucks');

const configDB = require('./config/database');
const configServer = require('./config/server');
const configViews = require('./config/views');

const userRoutes = require('./routes/users');
const playerRoutes = require('./routes/players');
const gameRoutes = require('./routes/games');
const apiRoutes = require('./routes/api');

const Player = require('./models/Player');
const Game = require('./models/Game');


// Create a new express app
const app = express();

// Set up mongoose connection (see http://mongoosejs.com/docs/connections.html#use-mongo-client)
// Use native promises (see http://mongoosejs.com/docs/promises.html)
mongoose.Promise = global.Promise;
mongoose.connect(configDB.url, {useMongoClient: true});

// Static files
app.use('/static', express.static(`${__dirname}/public`));

// Template engine configuration
configViews(app, nunjucks);

/************************************************************
 * End points
 ************************************************************/
// Home page
app.get('/', (req, res) => {
    Game.find({}).sort('-datetime').limit(10).exec((err, games) => {
        res.render('base/landing_page', {games: games});
    });
});

// Register user routes
app.use('/users', userRoutes);

// Register player routes
app.use('/players', playerRoutes);

// Register game routes
app.use('/games', gameRoutes);

// Register api routes
app.use('/api', apiRoutes);

/************************************************************
 * Server listening on port
 ************************************************************/
app.listen(configServer.port, () => console.log(`Example app listening on port ${configServer.port}!`));

/************************************************************
 * Export app to use it in testing
 ************************************************************/
module.exports.app = app;