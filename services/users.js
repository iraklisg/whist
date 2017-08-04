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
     * @param {String} username
     * @returns {Promise}
     */
    getUserByUsername(username) {
        return User.find({username}).exec();  // exec() on find returns a Promise instead of the default callback
    },

    /**
     * Checks if a user is Chuck Norris
     * @param {String} username
     * @returns {Boolean}
     */
    isChuckNorris(username) {
        return username === 'Chuck Norris';
    },

    /**
     * Saves a new user to database
     * @param {Object} data
     * @returns {Promise} - Either fulfilled with new user or rejected with error
     */
    saveUser(data) {
        return User({username: data.username}).save();
    },

    /**
     * Update an existing user
     * @param id
     * @param data
     * @returns {Promise}
     */
    updateUser(id, data) {
        return User.findOneAndUpdate(id, {$set: data}, {new: true}).exec(); // ╯°□°）╯︵ ┻━┻
        // https://stackoverflow.com/questions/32811510/mongoose-findoneandupdate-doesnt-return-updated-document
    }

};

module.exports = userService;