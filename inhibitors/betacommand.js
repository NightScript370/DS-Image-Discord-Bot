const { Inhibitor } = require('discord-akairo');

class BlacklistInhibitor extends Inhibitor {
    constructor() {
        super('blacklist', {
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

module.exports = BlacklistInhibitor;