const { Listener } = require('discord-akairo');
const Logger = require('../../utils/Logger');

module.exports = class errorListener extends Listener {
    constructor() {
        super('error', {
            emitter: 'commandHandler',
            event: 'error',
            category: 'commandHandler'
        });
    }

    exec(error, message, command=null) {
		Logger.error('An error occured in a command.');

		const tag = message.guild ? message.guild.name : `${message.author.tag}/PM`;
		Logger.error(message.content, { tag });
		Logger.stacktrace(error);

		if (message.channel.sendable) {
            if (error.toString().includes('UDP Watchdog Timeout'))
                return message.util.reply("The game server is offline. Please try connecting at a later date");

            if (error.stack.includes('ENOTFOUND'))
                return message.util.reply("The game server was not found. Please try again.");

            if (error.stack.includes('TCP Connection Refused'))
                return message.util.reply("The game server refused the connection. Please try again.");

			const owners = this.client.ownerID.map(id => this.client.users.get(id).tag);
            const isOwner = owners.filter(owner => msg.author.tag == owner).length;

            const cleanError = error.toString()
			message.util.send([
				'An error occured' + isOwner ? '' : `, please contact ${owners.join(' or ')}.`,
				'```js',
				error.toString(),
				'```'
			]);
		}
    }
}