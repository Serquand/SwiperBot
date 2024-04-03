const { promisify } = require("util");
const { glob } = require("glob");

/**
 *
 * @param {String} path
 * @returns {Promise<Array<String>>}
 */
const getAllFilesFromDirectory = async (path) => {
    return await promisify(glob)(path);
}

module.exports = {
    getAllFilesFromDirectory,
}