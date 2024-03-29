const { promisify } = require("util");
const { glob } = require("glob");

const pGlob = promisify(glob);

module.exports.commandHandler = async (client) => {
    (await pGlob(`${process.cwd()}/src/commands/*.js`)).map(async (cmdFile) => {
        const cmd = require(cmdFile);
        if(cmd.isDisabled) return;
        if(!cmd.name || !cmd.description) {
            return console.error("------\nCommande pas chargée : Pas de description ou de nom\n------")
        }
        client.commands.set(cmd.name, cmd);
        console.log("Commande chargée : ", cmd.name);
    });
}

module.exports.eventHandler = async (client) => {
    (await pGlob(`${process.cwd()}/src/events/*.js`)).map(async (eventFile) => {
        const event = require(eventFile);
        console.log('Evenement chargé :  ' + event.name);
        if(event.once == true) {
            client.once(event.name, (...args) => event.execute(client, ...args));
        } else {
            client.on(event.name, (...args) => event.execute(client, ...args));
        }
    })
}