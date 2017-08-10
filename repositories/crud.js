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
            const models = await Model.find({}).exec();
            return models;
        },

        /**
         * Get a player by id.
         * @param id
         * @returns {Promise.<obj>} - The player of given id
         */
        async get (id) {
            // const player = _players.filter(player => player.id === id);
            const model = await Model.findById(id).exec();
            return model;
        },

        /**
         * Creates a new player.
         * @param data - The player properties
         * @returns {Promise.<obj>}
         */
        async create(data) {
            const newModel = await Model.create(data);
            return newModel;
        },

        /**
         * Updates a player.
         * @param id - The id of the player we want to create
         * @param data - The new data for this player
         * @returns {Promise.<obj>}
         */
        async update(id, data) {
            const updatedModel = await Model.findOneAndUpdate(id, {$set: data}, {new: true}).exec();
            return updatedModel
        }
    }
};

module.exports = crudActions;