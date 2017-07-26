const express = require('express');
const routes = require('./routes');
// import express from 'express'; // see: https://stackoverflow.com/questions/42645548/using-import-in-nodejs-server

const app = express();

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Hello motherfucker!!!');
});

app.use('/foo', routes); // console.log "Hello" when visiting example.com/foo/users/foobar

app.listen(port, () => console.log('Example app listening on port 3000!'));
