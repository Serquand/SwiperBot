const { Client, Message, Guild, Channel, TextChannel, Interaction, MessageActionRow, MessageButton, MessageEmbed, TextInputComponent } = require("discord.js");

/**
 *
 * @param {Client} client
 * @param {String} guildId
 * @returns {Guild}
 */
function getTheGuild(client, guildId) {
    return client.guilds.cache.get(guildId);
}

/**
 *
 * @param {Client} client
 * @param {String} channelId
 * @returns {Promise<Channel | null>}
 */
async function getTheChannel(client, channelId) {
    try {
        const channel = await client.channels.fetch(channelId);
        return channel;
    } catch (error) {
        return null;
    }
}

/**
 *
 * @param {TextChannel} channel
 * @param {String} messageId
 * @returns {Promise<Message | null>}
 */
async function getTheMessage(channel, messageId) {
    try {
        const message = await channel.messages.fetch(messageId);
        return message;
    } catch (error) {
        return null;
    }
}

/**
 *
 * @param {Client} client
 * @param {String} messageId
 * @returns {Promise<Message | null>}
 */
async function fetchMessageById(client, channelId, messageId) {
    try {
        const channel = await getTheChannel(client, channelId);
        if (channel === null) return null;
        return getTheMessage(channel, messageId);
    } catch (e) {
        return null;
    }
}

/**
 *
 * @param {Interaction} interaction
 */
function sendBadInteraction(interaction, error) {
    interaction.isRepliable() && interaction.reply({ content: error || "Something bad happened", ephemeral: true });
}

/**
 *
 * @param {String} customId
 * @returns {MessageActionRow}
 */
function generateButtonToSwitchSwiperImage(customId) {
    const nextButton = new MessageButton()
        .setCustomId(customId + '+next')
        .setEmoji("⏭️")
        .setLabel('Next image')
        .setStyle('PRIMARY')

    const previousButton = new MessageButton()
        .setCustomId(customId + '+previous')
        .setEmoji('⏮️')
        .setLabel('Previous image')
        .setStyle('PRIMARY')

    return new MessageActionRow().addComponents(previousButton, nextButton);
}

/**
 * @param {String} customId
 * @returns {Array<MessageActionRow>}
 */
function generateButtonToUpdateEmbed(customId) {
    const updateThumbnailButton = new MessageButton().setCustomId('embed+' + customId + '+thumbnail').setLabel('Modifier le thumbnail').setStyle('PRIMARY');
    const updateAuthorButton = new MessageButton().setCustomId('embed+' + customId + '+author').setLabel('Modifier l\'auteur').setStyle('PRIMARY');
    const updateTitleButton = new MessageButton().setCustomId('embed+' + customId + '+title').setLabel('Modifier le titre').setStyle('PRIMARY');
    const updateColorButton = new MessageButton().setCustomId('embed+' + customId + '+color').setLabel('Modifier la couleur').setStyle('PRIMARY');
    const updateDescriptionButton = new MessageButton().setCustomId('embed+' + customId + '+description').setLabel('Modifier la description').setStyle('PRIMARY');
    const addFieldButton = new MessageButton().setCustomId('embed+' + customId + '+add-field').setLabel('Ajouter un champ').setStyle('PRIMARY');
    const removeFieldButton = new MessageButton().setCustomId('embed+' + customId + '+remove-field').setLabel('Supprimer un champ').setStyle('PRIMARY');
    const updateFooterButton = new MessageButton().setCustomId('embed+' + customId + '+footer').setLabel('Modifier le footer').setStyle('PRIMARY');
    const updateImageButton = new MessageButton().setCustomId('embed+' + customId + '+image').setLabel('Modifier l\'image').setStyle('PRIMARY');
    const updateSwiperButton = new MessageButton().setCustomId('embed+' + customId + '+swiper').setLabel('Modifier le swiper').setStyle('PRIMARY');
    const updateUrlButton = new MessageButton().setCustomId('embed+' + customId + '+url').setLabel('Modifier l\'URL').setStyle('PRIMARY');
    const saveButton = new MessageButton().setCustomId('embed+' + customId + '+save').setLabel('Sauvegarder').setStyle('PRIMARY');

    const firstLine = new MessageActionRow()
        .addComponents(updateThumbnailButton, updateAuthorButton, updateTitleButton, updateColorButton, updateDescriptionButton);
    const secondLine = new MessageActionRow()
        .addComponents(addFieldButton, removeFieldButton, updateFooterButton, updateImageButton, updateSwiperButton);
    const thirdLine = new MessageActionRow()
        .addComponents(updateUrlButton, saveButton);

    return [firstLine, secondLine, thirdLine];
}

function getTextInputForActionUpdateModal(action, customId) {
    if (action === 'thumbnail') {
        const thumbnailInput = new TextInputComponent()
            .setCustomId(customId + '-thumbnail')
            .setLabel('Thumbnail')
            .setRequired(false)
            .setStyle('SHORT')
        return [new MessageActionRow().addComponents(thumbnailInput)];
    } else if (action === 'author') {
        const authorNameInput = new TextInputComponent()
            .setCustomId(customId + '-authorName')
            .setLabel('Nom de l\'auteur')
            .setRequired(false)
            .setStyle('SHORT')

        const authorIconUrlInput = new TextInputComponent()
            .setCustomId(customId + '-authorIconUrl')
            .setLabel('URL de l\'icone')
            .setRequired(false)
            .setStyle('SHORT')

        const authorUrlInput = new TextInputComponent()
            .setCustomId(customId + '-authorUrl')
            .setLabel('URL de l\'auteur')
            .setRequired(false)
            .setStyle('SHORT')
        return [
            new MessageActionRow().addComponents(authorNameInput),
            new MessageActionRow().addComponents(authorIconUrlInput),
            new MessageActionRow().addComponents(authorUrlInput),
        ];
    } else if (action === 'title') {
        const titleInput = new TextInputComponent()
            .setCustomId(customId + '-title')
            .setLabel('Titre')
            .setRequired(false)
            .setStyle('SHORT')
        return [new MessageActionRow().addComponents(titleInput)];
    } else if (action === 'color') {
        const titleInput = new TextInputComponent()
            .setCustomId(customId + '-color')
            .setLabel('Couleur')
            .setRequired(false)
            .setStyle('SHORT')
        return [new MessageActionRow().addComponents(titleInput)];
    } else if (action === 'description') {
        const titleInput = new TextInputComponent()
            .setCustomId(customId + '-description')
            .setLabel('Couleur')
            .setRequired(false)
            .setStyle('PARAGRAPH')
        return [new MessageActionRow().addComponents(titleInput)];
    } else if (action === 'add-field') {
        const nameInput = new TextInputComponent()
            .setCustomId(customId + '-name-field-input')
            .setLabel('Nom du champ')
            .setRequired(false)
            .setStyle('SHORT')

        const valueInput = new TextInputComponent()
            .setCustomId(customId + '-value-field-input')
            .setLabel('Valeur du champ')
            .setRequired(false)
            .setStyle('PARAGRAPH')

        const inline = new TextInputComponent()
            .setCustomId(customId + '-inline-field-input')
            .setLabel('Champ inline ? Réponse : Oui/Non')
            .setRequired(false)
            .setStyle('SHORT')

        return [
            new MessageActionRow().addComponents(nameInput),
            new MessageActionRow().addComponents(valueInput),
            new MessageActionRow().addComponents(inline)
        ];
    } else if (action === 'remove-field') {
        const titleInput = new TextInputComponent()
            .setCustomId(customId + '-remove-field-name')
            .setLabel('Champ à supprimer')
            .setRequired(false)
            .setStyle('SHORT')
        return [new MessageActionRow().addComponents(titleInput)];
    } else if (action === 'footer') {
        const textInput = new TextInputComponent()
            .setCustomId(customId + '-footer-text')
            .setLabel('Texte du champ')
            .setRequired(false)
            .setStyle('SHORT')

        const iconUrlInput = new TextInputComponent()
            .setCustomId(customId + '-footer-icon-url')
            .setLabel("URL de l'icône")
            .setRequired(false)
            .setStyle('SHORT')

        return [
            new MessageActionRow().addComponents(textInput),
            new MessageActionRow().addComponents(iconUrlInput),
        ];
    } else if (action === 'image') {
        const titleInput = new TextInputComponent()
            .setCustomId(customId + '-image')
            .setLabel('Nouvelle image')
            .setRequired(false)
            .setStyle('SHORT')
        return [new MessageActionRow().addComponents(titleInput)];
    } else if (action === 'swiper') {
        const titleInput = new TextInputComponent()
            .setCustomId(customId + '-swiper-name')
            .setLabel('Nouveau swiper')
            .setRequired(false)
            .setStyle('SHORT')
        return [new MessageActionRow().addComponents(titleInput)];
    } else if (action === 'url') {
        const titleInput = new TextInputComponent()
            .setCustomId(customId + '-url')
            .setLabel('URL de l\'Embed')
            .setRequired(false)
            .setStyle('SHORT')
        return [new MessageActionRow().addComponents(titleInput)];
    }
}

module.exports = {
    fetchMessageById,
    getTheGuild,
    getTheChannel,
    getTheMessage,
    sendBadInteraction,
    generateButtonToSwitchSwiperImage,
    generateButtonToUpdateEmbed,
    getTextInputForActionUpdateModal
}