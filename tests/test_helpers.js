const mongoose = require('mongoose');
// mongoose.Promise = global.Promise;

module.exports = {
    setupDatabase(Model) {
        /**
         * Before all tests, open a new mongodb connection
         */
        before((done) => {
            mongoose.connect("mongodb://localhost:27017/whist_testing", {useMongoClient: true});
            mongoose.connection
                .once('open', () => {
                    console.log('mongoDB is connected');
                    done();
                })
                .on('error', (err) => console.warn(err));
        });

        /**
         * After each test clear database
         */
        beforeEach((done) => {
            Model.remove({}, (err) => {
                if (err) console.warn(err);
                console.log('User collection is clear');
                done();
            })
            // mongoose.connection.db.dropDatabase(done);

            // mongoose.connection.collection.users.drop(() => { // does mongo create collections on the fly???
            //     done();
            // })
        });

        /**
         * After all test close the connection
         */
        after((done) => {
            mongoose.disconnect(() => {
                console.log('Connection is closed'); // we have to assure that all db transactions are completed
                done();
            });
            // mongoose.connection.close(done);
        });
    }
};