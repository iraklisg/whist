/*
For Using ES6 modules see https://stackoverflow.com/questions/42645548/using-import-in-nodejs-server
*/
const express = require('express');
const routes = require('./routes');
const configServer = require('./config/server');
const mongoose = require('mongoose');
const configDB = require('./config/database');

// Create a new express app
const app = express();

// Set up mongoose connection (see http://mongoosejs.com/docs/connections.html#use-mongo-client)
mongoose.connect(configDB.url);

// End points ????
app.get('/', (req, res) => res.send('Hello motherfuckers!!!'));
app.use('/foo', routes); // console.log "Hello" when visiting example.com/foo/users/foobar

app.listen(configServer.port, () => console.log('Example app listening on port 3000!'));
