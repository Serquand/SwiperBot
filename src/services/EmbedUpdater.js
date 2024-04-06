const { MessageComponentInteraction, Modal, ModalSubmitInteraction, MessageEmbed } = require("discord.js");
const { getEmbedByUid } = require("./Embed");
const { sendBadInteraction, getTextInputForActionUpdateModal, generateButtonToUpdateEmbed } = require("../tools/discord");
const { getSwiperByName } = require("./Swiper");

class EmbedUpdaterManager {
    constructor () {
        this.possibleAction = ['thumbnail', 'author', 'title', 'color', 'description', 'add-field', 'remove-field', 'footer', 'image', 'swiper', 'url', 'save'];
    }

    /**
     *
     * @param {MessageComponentInteraction} interaction
     */
    handleInteraction(interaction) {
        const action = interaction.customId.split('+')[2];
        const embed = getEmbedByUid(interaction.customId.split('+')[1]);
        const uid = interaction.customId.split('+')[1];
        if(!embed || !this.possibleAction.includes(action)) return sendBadInteraction(interaction, "Type de modification non valide");

        if(action === 'save') {
            return this.saveModal(interaction, uid, interaction.message.embeds[0], interaction.message.content);
        }

        // Submit the modal
        const modal = new Modal()
            .setCustomId(embed.uid + '+' + action)
            .setTitle('Modification de l\'Embed')
            .setComponents(...getTextInputForActionUpdateModal(action, uid))
        interaction.showModal(modal);
    }

    /**
     *
     * @param {MessageComponentInteraction} interaction
     * @param {String} uid
     * @param {MessageEmbed} embed
     * @param {String} content
     */
    saveModal(interaction, uid, embed, content) {
        console.log(interaction, uid, embed, content);
    }

    /**
     *
     * @param {ModalSubmitInteraction} interaction
     */
    async handleModalSubmission (interaction) {
        const message = interaction.message;
        const embed = interaction.message.embeds[0];
        const toUpdate = interaction.customId.split('+')[1];
        const uid = interaction.customId.split('+')[0];
        let content = interaction.message.content;

        if (!this.possibleAction.includes(toUpdate)) return sendBadInteraction(interaction);

        switch (toUpdate) {
            case 'thumbnail':
                embed.setThumbnail(interaction.fields.getTextInputValue(uid + '-thumbnail'))
                break;
            case 'author':
                const author = {
                    name: interaction.fields.getTextInputValue(uid + '-authorName'),
                    url: interaction.fields.getTextInputValue(uid + '-authorUrl'),
                    iconURL: interaction.fields.getTextInputValue(uid + '-authorIconUrl'),
                };
                embed.setAuthor(author);
                break;
            case 'title':
                embed.setTitle(interaction.fields.getTextInputValue(uid + '-title'));
                break;
            case 'color':
                embed.setColor(interaction.fields.getTextInputValue(uid + '-color'));
                break;
            case 'description':
                embed.setDescription(interaction.fields.getTextInputValue(uid + '-description'));
                break;
            case 'add-field':
                const newField = {
                    name: interaction.fields.getTextInputValue(uid + '-name-field-input'),
                    value: interaction.fields.getTextInputValue(uid + '-value-field-input'),
                    inline: interaction.fields.getTextInputValue(uid + '-inline-field-input').toLowerCase() === 'oui',
                };
                embed.addFields(newField);
                break;
            case 'remove-field':
                const fieldNameToDelete = interaction.fields.getTextInputValue(uid + '-remove-field-name');
                const listFields = embed.fields.filter(field => field.name !== fieldNameToDelete);
                embed.setFields(...listFields);
                break;
            case 'footer':
                const footer = {
                    text: interaction.fields.getTextInputValue(uid + '-footer-text'),
                    iconURL: interaction.fields.getTextInputValue(uid + '-footer-icon-url'),
                };
                embed.setFooter(footer);
                break;
            case 'url':
                embed.setURL(interaction.fields.getTextInputValue(uid + '-url'));
                break;
            case 'image':
                content = content.split("\nSwiper associé à l'Embed : ")[0] + "\nSwiper associé à l'Embed : Aucun";
                embed.setImage(interaction.fields.getTextInputValue(uid + '-image'));
                break;
            case 'swiper':
                const swiper = getSwiperByName(interaction.fields.getTextInputValue(uid + '-swiper-name'));

                if(!swiper) return sendBadInteraction(interaction, "Le nom du Swiper est invalide !");
                if(swiper.swiperImages.length === 0) return sendBadInteraction(interaction, "Le Swiper ne contient pas d'image !");

                content = content.split("\nSwiper associé à l'Embed : ")[0] + "\nSwiper associé à l'Embed : " + swiper.swiperName;
                embed.setImage(swiper.swiperImages[0].imageUrl);
                break;
        }

        try {
            await message.edit({
                content,
                embeds: [embed],
                components: generateButtonToUpdateEmbed(uid),
            });
            return interaction.deferUpdate();
        } catch (error) {
            return sendBadInteraction(interaction);
        }
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