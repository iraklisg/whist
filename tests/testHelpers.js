const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

module.exports = {
    /**
     * Connect to a database (first disconnect from other databases)
     * @param name - The name of the database
     * @returns {Promise<any>} - Resolves to `db` The variable that references the current database in the mongo shell
     */
    connect(name) {
        return this.disconnectAll()
            .then(() => {
                return mongoose.connect(`mongodb://localhost:27017/${name}`, {
                    useMongoClient: true
                });
            }).catch(err => console.error(err))
    },

    /**
     * Disconnect from all databases
     * @returns {"mongoose".MongooseThenable}
     */
    disconnectAll() {
        return mongoose.disconnect()
    },

    /**
     * Disconnect from a given connection
     * @param db - The connection db instance
     * @returns {void|MongooseThenable}
     */
    disconnect(db) {
        return db.disconnect();
    },

    /**
     * Clear all documents from a given collection
     * @param Model
     * @returns {Promise}
     * @see The operation is only executed when a callback is passed. To force execution without a callback,
     * you must first call remove() and then execute it by using the exec() method.
     */
    clear(Model) {
        return Model.remove({}).exec();
        // return Model.collection.drop()
    }
};