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
         *  - listen for 'open' or 'error' event
         */
        before((done) => {
            mongoose.disconnect((err) => {
                if (err) console.warn(err);
                console.log('All connections closed');
            })
                .then(() => {
                    const promise = mongoose.connect(`mongodb://localhost:27017/${databaseName}`, {
                        useMongoClient: true
                    });
                    promise.then(connection => {
                        console.log(`Connected to ${connection.db.databaseName} database`);
                        done()
                    });
                    promise.catch(err => console.warn(err));
                });
        });

        /**
         * After each test clear all collections
         */
        beforeEach((done) => {
            collections.forEach(collection => {
                collection.remove({}, (err) => {
                    if (err) console.warn(err);
                    console.log('User collection is clear');
                    done();
                });
            });
        });

        /**
         * After all test close the connection
         */
        after((done) => {
            mongoose.disconnect(() => {
                console.log('Testing connection is closed'); // we have to assure that all db transactions are completed
                done();
            });
        });
    }
};