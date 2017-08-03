const mongoose = require('mongoose');
// mongoose.Promise = global.Promise;

module.exports = {
    /**
     * Use this function in the beginning of each test, to properly a testing database
     * @param {String} databaseName - The name of the database
     * @param {Array} collections - An array of models
     */
    setupDatabase(databaseName, collections) {

        /**
         * Before all tests:
         *  - Disconnects all connections (prevent accessing the default connection and alter data)
         *  - connect to testing database
         */
        before((done) => {
            mongoose
                .disconnect()
                .then(() => mongoose.connect(`mongodb://localhost:27017/${databaseName}`, {useMongoClient: true}))
                .then(() => done())
                .catch(err => console.error(err));
        });

        /**
         * After each test clear all collections
         */
        beforeEach((done) => {
            collections.forEach(collection => {
                collection.remove({}, err => err ? console.error(err) : done());
            });
        });

        /**
         * After all test close the connection
         */
        after((done) => {
            mongoose.disconnect()
                .then(() => done())
                .catch(err => console.error(err));
        });
    }
};