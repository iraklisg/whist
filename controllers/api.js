const _ = require('lodash');

const {makePlayersService} = require('../services/players');
const {makeCommonServices} = require('../services/app/common');
const {makePlayersRepository} = require('../repositories/players');

const playersService = makePlayersService(makePlayersRepository(), makeCommonServices());

module.exports = {

    async getRankings(nickname) {
        const player = await playersService.getByNickname(nickname);
        const rankings = await playersService.getRankings(player);

        return rankings.map(ranking => {return {gameId: ranking.gameId, rank: ranking.rank}});
    }
};
