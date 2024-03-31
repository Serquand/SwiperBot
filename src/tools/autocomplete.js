const { AutocompleteInteraction } = require("discord.js");

/**
 *
 * @param {AutocompleteInteraction} interaction
 * @param {Array<any>} listValues
 * @param {String} key
 */
function sendAutocomplete (interaction, listValues, key) {
    let listToSend = listValues
        .map(value => value[key])
        .map(el => {
            const isValid =  el.toLowerCase().includes(interaction.options.getFocused().toLowerCase());
            if(isValid) return { name: el, value: el };
            else return null;
        })
        .filter(el => el !== null);
    interaction.respond(listToSend);
}

module.exports = { sendAutocomplete }