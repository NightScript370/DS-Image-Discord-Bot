const { Listener } = require('discord-akairo');

module.exports = class CommandBlockedListener extends Listener {
    constructor() {
        super('commandBlocked', {
            emitter: 'commandHandler',
            event: 'commandBlocked',
            category: 'commandHandler'
        });
    }

    exec(message, command, reason) {
        console.log(this.client.ownerID);
        const text = {
			owner: () => "we're sorry, but the " + command.id + " command may only be used by the bot owners.",
			guild: () => "we're sorry, but the " + command.id + " command may only be used in a server."
		}[reason];

		const tag = message.guild ? message.guild.name : `DM`;
        console.log(`${message.author.username} (#${message.author.id}) was blocked from using ${command.id} in ${tag} because of ${reason}!`);

		if (!text) return;
		if (message.guild ? message.channel.permissionsFor(this.client.user).has('SEND_MESSAGES') : true) {
			message.reply(text());
        }
    }
};