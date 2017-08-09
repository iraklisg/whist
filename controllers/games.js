const _ = require('lodash');

const {getAllGames, getGameById, saveGame, updateGame, getWinners} = require('../services/games');


const gameController = {

    /**
     * Get all games from database
     * @returns {Promise.<*>}
     */
    async getGames() {
        // there is no await statement on the return statement,
        // because the return value of an async function
        // is implicitly wrapped in Promise.resolve.
        // let allGames = getAllGames().then(games => {
        //     games.map(game => {
        //         // getWinners(game.id).then(m => {console.log(m)});
        //         getWinners(game.id).then(res => {game.winners = res;});
        //         // console.log(game.winners);
        //         return game;
        //     });
        //     return games
        // });
        // return allGames;
        return getAllGames();
    },

    /**
     * Get a game by id from database
     * @param id
     * @returns {Promise.<*>}
     */
    async getGame(id) {
        if (id === '') throw new Error('Id cannot be blank');
        return getGameById(id);
    },

    /**
     * Save a new game to database
     * @param data
     * @returns {Promise.<*>}
     */
    async storeGame(data) {
        // see https://stackoverflow.com/questions/679915/how-do-i-test-for-an-empty-javascript-object
        if (_.isEmpty(data)) throw new Error('No data provided');
        return saveGame(data);
    },

    /**
     * Update an existing game
     * @param id
     * @param data
     * @returns {Promise.<void>}
     */
    async putGame(id, data) {
        if (_.isEmpty(data)) throw new Error('No data provided');
        return updateGame(id, data);
    }
};

module.exports = gameController;
