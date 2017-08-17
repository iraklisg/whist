const _ = require('lodash');

const {makePlayersService} = require('../services/players'); // this is a factory
const {makeCommonServices} = require('../services/app/common'); // this is a factory
const {makePlayersRepository} = require('../repositories/players'); // this is a factory

// Instantiate a service object; players repository is passed as a dependency
// See the following for implementing an IOC for dependency injection
// https://medium.com/@Jeffijoe/dependency-injection-in-node-js-2016-edition-part-3-c01471c09c6d
// https://medium.com/@slavahatnuke/manage-your-services-node-js-dependency-injection-4412f4f62f84
const playersService = makePlayersService(makePlayersRepository(), makeCommonServices());

const playerController = {

    /**
     * Get all players from database
     * @returns {Promise.<*>}
     */
    async getPlayers() {
        const players = await playersService.getAll();

        return await Promise.all(players.map(async (player) => {
            return {
                first_name: player.first_name,
                last_name: player.last_name,
                nickname: player.nickname,
                highScore: await playersService.getHighestScore(player),
                lowScore: await playersService.getLowestScore(player),
                averageScore: await playersService.getAverageScore(player),
                aggregatedRankings: await playersService.getAggregatedRankings(player),
                highPoint: await playersService.getHighestPoint(player),
                lowPoint: await playersService.getLowestPoint(player),
            }
        }))
    },

    /**
     * Get a player by nickname from database
     * @param nickname
     * @returns {Promise.<*>}
     */
    async getPlayer(nickname) {
        if (nickname === '') throw new Error('Nickname cannot be blank');
        return playersService.getByNickname(nickname);
    },

    /**
     * Save a new player to database
     * @param data
     * @returns {Promise.<*>}
     */
    async storePlayer(data) {
        if (_.isEmpty(data)) throw new Error('No data provided'); // see https://stackoverflow.com/questions/679915/how-do-i-test-for-an-empty-javascript-object
        return playersService.create(data);
    },

    /**
     * Update an existing player
     * @param id
     * @param data
     * @returns {Promise.<void>}
     */
    async putPlayer(id, data) {
        if (_.isEmpty(data)) throw new Error('No data provided');
        return playersService.update(id, data);
    }
};

module.exports = playerController;