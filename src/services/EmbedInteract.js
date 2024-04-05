const { MessageComponentInteraction } = require("discord.js");
const { getEmbedByUid } = require("./Embed");
const { getNextIndex, getPreviousIndex } = require("../tools/utils");
const { generateButtonToSwitchSwiperImage } = require("../tools/discord");

class EmbedInteractManager {
    constructor () {
        this.allInteractions = {};
    }

    addEmbedInteract (uid, embedId, interaction) {
        this.allInteractions[uid] = { embedId, interaction, imageIndex: 0 };
        setTimeout(() => {
            delete this.allInteractions[uid];
            interaction.deleteReply();
        }, 5 * 60 * 1_000);
    }

    /**
     *
     * @param {MessageComponentInteraction} interaction
     */
    handleInteraction(interaction) {
        const uid = interaction.customId.split('+')[0], action = interaction.customId.split('+')[1];
        const info = this.allInteractions[uid], embed = getEmbedByUid(info?.embedId);

        if(!info || !embed || !embed.swiper || embed.swiper.swiperImages.length === 0) return;

        const length = embed.swiper.swiperImages.length;
        const newImageIndex = action === 'next' ? getNextIndex(info.imageIndex, length) : getPreviousIndex(info.imageIndex, length);
        this.allInteractions[uid].imageIndex = newImageIndex;

        const embedToSend = embed.generateEmbed();
        const newImageUrl = embed.swiper.swiperImages[newImageIndex].imageUrl;
        embedToSend.setImage(newImageUrl);

        info.interaction.editReply({
            embeds: [embedToSend],
            ephemeral: true,
            components: [generateButtonToSwitchSwiperImage(uid)]
        });
        interaction.deferUpdate();
    }
};

const embedInteractManager = new EmbedInteractManager();

/**
 *
 * @returns {EmbedInteractManager}
 */
function getEmbedInteractManager() {
    return embedInteractManager;
}

module.exports = { getEmbedInteractManager };