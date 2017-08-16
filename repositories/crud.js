/**
 * Generic factory that returns an object that contains
 * the basic crud actions for a given model
 * @param modelName
 * @returns {*}
 */
const crudActions = (modelName) => {

    const Model = require(`../models/${modelName}`);
    // const Model = modelName; // in this case is an actual Mongoose instance

    return {
        async getAll() {
            return await Model.find({}).exec();
        },

        /**
         * Get a player by id.
         * @param id
         * @returns {Promise.<obj>} - The player of given id
         */
        async get(id) {
            // const player = _players.filter(player => player.id === id);
            return await Model.findById(id).exec();
        },

        /**
         * Creates a new player.
         * @param data - The player properties
         * @returns {Promise.<obj>}
         */
        async create(data) {
            return await Model.create(data);
        },

        /**
         * Updates a player.
         * @param id - The id of the player we want to create
         * @param data - The new data for this player
         * @returns {Promise.<obj>}
         */
        async update(id, data) {
            return await Model.findOneAndUpdate(id, {$set: data}, {new: true}).exec();
        }
    }
};

module.exports = crudActions;