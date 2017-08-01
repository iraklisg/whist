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
     * @returns {Promise}
     */
    saveUser(data) {
        console.log(data);
        return User({
            username: data.username
        }).save(); // TODO: assert that returns a fully-fledged Promise
    }

};

module.exports = userService;