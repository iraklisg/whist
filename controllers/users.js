/**
 * Users controller module.
 * @module /controllers/users
 */

const {getUserByUsername} = require('../services/user');

/**
 * Get a user by username.
 * @param username a string value that represents user's username.
 * @returns A Promise, an exception or a value.
 */
const getUser = async (username) => {
    if (username === '') throw new Error('Username cannot be blank');
    const user = await getUserByUsername(username);
    return user;
};

module.exports.getUser = getUser;