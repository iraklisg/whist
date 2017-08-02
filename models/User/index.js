/**
 * User model module.
 * @module /models/User
 */

const mongoose = require('mongoose');
const {validateUsername} = require('./validate');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true,
        validate: [{validator: validateUsername, msg: 'Invalid username'}],
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;