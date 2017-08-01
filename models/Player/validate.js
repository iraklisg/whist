const Player = require('./index');


module.exports = {
  validateNickname (nickname) {
      Player.findOne({nickname: nickname}).count(function(err, count) {
          if (err) throw err;
          return count === 0;
      });
  }
};
