const mongoose = require('mongoose');
const _ = require('lodash');

const Player = require('../models/Player');
const Game = require('../models/Game');
const data = require('./dbSeed.json');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/whist', {useMongoClient: true});

/**
 * Create new players in database
 * @param players
 * @returns {Promise}
 */
const seedPlayers = (players) => {
    return Player.create(players);
};

/**
 * Create new games in database
 * @param data
 * @returns {Promise.<Promise|Promise<T>|any|Array|{index: number, input: string}>}
 */
const seedGames = async (data) => {
    try {

        // First save players to database
        const players = await seedPlayers([
            {first_name: 'Iraklis', last_name: 'Georgas', nickname: 'ira'},
            {first_name: 'John', last_name: 'Lamprakos', nickname: 'john'},
            {first_name: 'Nick', last_name: 'Mavrakis', nickname: 'nick'}
        ]);

        const gameData = data.map(game => {
            let orderNicknames = game.order;
            return {
                place: game.place,
                datetime: game.datetime,
                notes: game.notes,
                players: game.players.map(player => {
                    let id = _.find(players, {nickname: player.nickname}).id;
                    let order = _.indexOf(orderNicknames, player.nickname) + 1;
                    return {
                        player: id,
                        points: player.points,
                        order: order,
                    }
                })
            };
        });

        return Game.create(gameData)

    } catch (err) {
        console.error(err)
    }
};

let p = seedGames(data);

p.catch(err => console.log(err));