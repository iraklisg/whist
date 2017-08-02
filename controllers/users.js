/**
 * Users controller module.
 *
 * We want our controllers to ALWAYS return a promise
 * If we are using ES6 Promises (to be consistent) we can use the following
 * to build the initialize Promise
 * chain = Promise.resolve();
 * ...
 * myFunc() {
 *     ....
 *     return chain
 *         .then(() => ...)
 *         .then(() => ...)
 * }
 *
 * If we are using ES2017 async / await, then we ALWAYS return a promise because
 * when an async function is called, it returns a Promise. When the async function returns a value,
 * the Promise will be resolved with the returned value. When the async function throws
 * an exception or some value, the Promise will be rejected with the thrown value.
 * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function#Rewriting_a_promise_chain_with_an_async_function
 *
 * @module /controllers/users
 */
const _ = require('lodash');
const {getUserByUsername, saveUser, getAllUsers} = require('../services/user');

const userController = {

    /**
     * Get all users from database
     * @returns {Promise.<*>}
     */
    async getUsers() {
        return getAllUsers();   // there is no await statement on the return statement,
                                // because the return value of an async function
                                // is implicitly wrapped in Promise.resolve.
    },

    /**
     * Get a user by username from database
     * @param username
     * @returns {Promise.<*>}
     */
    async getUser(username) {
        if (username === '') throw new Error('Username cannot be blank');
        return getUserByUsername(username);
    },

    /**
     * Save a new user to database
     * @param data
     * @returns {Promise.<*>}
     */
    async storeUser(data) {
        if (_.isEmpty(data)) throw new Error('No data provided'); // see https://stackoverflow.com/questions/679915/how-do-i-test-for-an-empty-javascript-object
        return saveUser(data);
    }
};

module.exports = userController;