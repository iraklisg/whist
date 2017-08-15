const _ = require('lodash');

const {makeGamesService} = require('../services/games');  // this is a factory
const {makeGamesRepository} = require('../repositories/games');  // this is a factory

// Instantiate a service object; games repository is passed as a dependency
// See the following for implementing an IOC for dependency injection
// https://medium.com/@Jeffijoe/dependency-injection-in-node-js-2016-edition-part-3-c01471c09c6d
// https://medium.com/@slavahatnuke/manage-your-services-node-js-dependency-injection-4412f4f62f84
const gamesService = makeGamesService(makeGamesRepository());

const gameController = {

    /**
     * Get all games from database
     * @returns {Promise.<*>}
     */
    async getGames() {
        let games = await gamesService.getAllGames();
        let enhancedGames = [];
        for (let game of games) {
            let winners = await gamesService.getWinners(game.id);
            enhancedGames.push({game: game, winners: winners});
        }
        return enhancedGames;
        // return games.map(async game => {
        //     let winners = await gamesService.getWinners(game.id);
        //     return {
        //         game: game,
        //         winners: winners
        //     };
        // });
    },

    /**
     * Get a game by id from database
     * @param id
     * @returns {Promise.<*>}
     */
    async getGame(id) {
        if (id === '') throw new Error('Id cannot be blank');
        return gamesService.getGameById(id);
    },

    /**
     * Save a new game to database
     * @param data
     * @returns {Promise.<*>}
     */
    async storeGame(data) {
        // see https://stackoverflow.com/questions/679915/how-do-i-test-for-an-empty-javascript-object
        if (_.isEmpty(data)) throw new Error('No data provided');
        return gamesService.saveGame(data);
    },

    /**
     * Update an existing game
     * @param id
     * @param data
     * @returns {Promise.<void>}
     */
    async putGame(id, data) {
        if (_.isEmpty(data)) throw new Error('No data provided');
        return gamesService.updateGame(id, data);
    }
};

module.exports = gameController;
