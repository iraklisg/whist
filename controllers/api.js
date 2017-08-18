const _ = require('lodash');
const moment = require('moment');

const {makePlayersService} = require('../services/players');
const {makeCommonServices} = require('../services/app/common');
const {makePlayersRepository} = require('../repositories/players');

const playersService = makePlayersService(makePlayersRepository(), makeCommonServices());

module.exports = {

    async getRankings(nickname) {
        const player = await playersService.getByNickname(nickname);
        const rankings = await playersService.getRankings(player);

        return _.sortBy(rankings, ['date']).map(ranking => {
            return {
                gameId: ranking.gameId,
                place: ranking.place,
                date: moment(ranking.date).format('DD/MM/YYYY, HH:mm'),
                rank: ranking.rank
            }
        });
    }
};
