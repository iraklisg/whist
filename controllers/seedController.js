const User = require('../models/User');

module.exports = function (app) {
    app.get('/api/seedUsers', (req, res) => {
        const starterUsers = [
            {
                username: 'Iraklis'
            },
            {
                username: 'Nikos'
            }
        ];

        User.create(starterUsers, (err, results) => {
            if (err) throw new Error(err);
            res.send(results);
        })
    });
};