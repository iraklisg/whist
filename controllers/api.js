const _ = require('lodash');

const {makePlayersService} = require('../services/players'); // this is a factory
const {makeCommonServices} = require('../services/app/common'); // this is a factory
const {makePlayersRepository} = require('../repositories/players'); // this is a factory

// Instantiate a service object; players repository is passed as a dependency
// See the following for implementing an IOC for dependency injection
// https://medium.com/@Jeffijoe/dependency-injection-in-node-js-2016-edition-part-3-c01471c09c6d
// https://medium.com/@slavahatnuke/manage-your-services-node-js-dependency-injection-4412f4f62f84
const playersService = makePlayersService(makePlayersRepository(), makeCommonServices());

const apiController = {

    async getRankings(nickname) {
        const player = await playersService.getByNickname(nickname);
        const rankings = await playersService.getRankings(player);



        return rankings.map(ranking => {return {gameId: ranking.gameId, rank: ranking.rank}});
    }

};

module.exports = apiController;
