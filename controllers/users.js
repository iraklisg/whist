/**
 * Get a user by username.
 * @param username a string value that represents user's username.
 * @returns A Promise, an exception or a value.
 */
const {getUserByUsername} = require('../services/user');

const getUser = async () => {
  // if (username === '') {
  //   throw new Error('Username cannot be blank');
  // }
  //
  // const user = await getUserByUsername(username);
  //
  // return user
  console.log('I am inside the controller !!!');
};

module.exports = getUser;
