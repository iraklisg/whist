const User = require('../models/User/index');

const starterUsers = [
    {
        username: 'ira'
    },
    {
        username: 'nick'
    },
    {
        username: 'john'
    }
];

/**
 *
 * @returns {Promise.<*>}
 */
const seedUsers = async () => {
        const foo = await User.create(starterUsers);
        return foo;
};

module.exports = seedUsers;