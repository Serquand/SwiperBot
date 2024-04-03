const { getListSelectMenu } = require("../services/SelectMenu");
const { sendBadInteraction } = require("../tools/discord");

module.exports = {
    name: 'list_select_menu',
    group: 'Select Menu',
    description: "Liste tous les Select Menus",
    runSlash: (client, interaction) => {
        const allSelectMenus = getListSelectMenu();
        const content = '**Voici la liste des Select Menus :** \n' + allSelectMenus.map((sm) => '- ' + sm.name).join('\n');
        return sendBadInteraction(interaction, content);
    }
}