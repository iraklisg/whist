const User = require('../models/User')

module.exports = {
  getUser(username) {
    return User.find({username}).exec; // exec() on find returns a Promise instead of the default callback
  },
  isChuckNorris(username) {
    return username === 'Chuck Norris';
  }
}
