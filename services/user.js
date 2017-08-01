/**
 * User service module.
 * @module /services/user
 */

const User = require('../models/User');

/**
 * The user service.
 * @type {{getUserByUsername: (function(*): (Promise|Promise.<T>|any|Array|{index: number, input: string})), isChuckNorris: (function(*): boolean)}}
 */
const userService = {
    /**
     * Finds a user by username
     * @param username
     * @returns {Promise|Promise<T>|any|Array|{index: number, input: string}}
     */
    getUserByUsername(username) {
        return User.find({username}).exec(); // exec() on find returns a Promise instead of the default callback
    },

    /**
     * Checks if a user is Chuck Norris
     * @param username
     * @returns {boolean}
     */
    isChuckNorris(username) {
        return username === 'Chuck Norris';
    }
};

module.exports = userService;