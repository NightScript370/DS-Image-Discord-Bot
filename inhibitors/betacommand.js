const { Inhibitor } = require('discord-akairo');

module.exports = class BetaCommandInhibitor extends Inhibitor {
    constructor() {
        super('beta', {
            reason: 'beta'
        })
    }

    exec(message, command) {
        if (!command) return false;

        if (command.beta)
            return this.client.ownerID.includes(message.author.id);

        return false;
    }
}