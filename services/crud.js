/**
 * Generic factory that returns an object that contains
 * the basic crud actions for a given model
 * @requires {String} modelName The name of the model for which the crud repository will return the actions
 * @param modelName
 * @returns {*}
 */
const crudServices = (modelName) => {

    const repository = require(`../repositories/crud`)(modelName);
    return {
        /*
        These are added to factory's prototype
        */

        /**
         * Returns all players
         * @returns {Promise}
         */
        async getAll() {
            return repository.getAll();
        },

        /**
         * Returns all players
         * @param {String} id - The player's ObjectId string representation
         * @returns {Promise}
         */
        async get (id) {
            return repository.get(id);
        },

        /**
         * Saves a new player to database
         * @param {Object} data
         * @returns {Promise}
         */
        async create(data) {
            return repository.create(data);
        },

        /**P
         * Update an existing player
         * @param id
         * @param data
         * @returns {Promise}
         */
        async update(id, data) {
            return repository.update(id, data)
        },
    }
};

module.exports = crudServices;