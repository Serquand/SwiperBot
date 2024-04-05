const { MessageComponentInteraction, Modal } = require("discord.js");
const { getEmbedByUid } = require("./Embed");
const { sendBadInteraction, getTextInputForActionUpdateModal } = require("../tools/discord");

class EmbedUpdaterManager {
    /**
     *
     * @param {MessageComponentInteraction} interaction
     */
    handleInteraction(interaction) {
        const possibleAction = ['thumnail', 'author', 'title', 'color', 'description', 'add-field', 'remove-field', 'footer', 'image', 'swiper', 'url', 'save'];
        const action = interaction.customId.split('+')[2];
        const embed = getEmbedByUid(interaction.customId.split('+')[1]);
        const uid = interaction.customId.split('+')[1];
        if(!embed || !possibleAction.includes(action)) return sendBadInteraction(interaction, "Type de modification non valide");

        if(action === 'save') {
            return interaction.reply('Coucouc');
        }

        // Submit the modal
        const modal = new Modal()
            .setCustomId(embed.uid + '-' + action)
            .setTitle('Modification de l\'Embed')
            .setComponents(...getTextInputForActionUpdateModal(action, uid))
        interaction.showModal(modal);
    }
}

const embedUpdaterManager = new EmbedUpdaterManager();

function getEmbedUpdaterManager() {
    return embedUpdaterManager;
}

module.exports = {
    EmbedUpdaterManager,
    getEmbedUpdaterManager
};