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

const getNextIndex = (currentIndex, length) => {
    if(currentIndex >= length - 1) return 0;
    return currentIndex + 1;
}

const getPreviousIndex = (currentIndex, length) => {
    if (currentIndex === 0) return length - 1;
    return currentIndex - 1;
}

module.exports = {
    getAllFilesFromDirectory,
    getNextIndex,
    getPreviousIndex,
}