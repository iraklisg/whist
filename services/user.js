/**
 * User service module.
 * @module /services/user
 */

const User = require('../models/User');

const userService = {

    getAllUsers() {
        return User.find({}).exec();
    },

    /**
     * Finds a user by username
     * @param username
     * @returns {Promise}
     */
    getUserByUsername(username) {
        return User.find({username}).exec();  // exec() on find returns a Promise instead of the default callback
    },

    /**
     * Checks if a user is Chuck Norris
     * @param username
     * @returns {boolean}
     */
    isChuckNorris(username) {
        return username === 'Chuck Norris';
    },

    /**
     * Saves a new user to database
     * @param data
     * @returns {Promise} - Either fulfilled with new user or rejected with error
     */
    saveUser(data) {
        return User({username: data.username}).save()
    }
};

module.exports = userService;