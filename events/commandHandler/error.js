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
		const tag = message.guild ? message.guild.name : `${message.author.tag}/PM`;

		if (command) {
			const current = this.client.commandHandler.games.get(message.author.id);
			if (current && current.name == command.id)
				this.client.commandHandler.games.delete(message.author.id);
		}

		if (message.channel.sendable) {
			if (error.toString().includes('UDP Watchdog Timeout'))
				return message.util.reply("The game server is offline. Please try connecting at a later date");

			if (error.stack.includes('ENOTFOUND'))
				return message.util.reply("The game server was not found. Please try again.");

			if (error.stack.includes('TCP Connection Refused'))
				return message.util.reply("The game server refused the connection. Please try again.");

			const owners = this.client.ownerID.map(id => this.client.users.get(id).tag);
			const isOwner = owners.filter(owner => message.author.tag == owner).length;

			let cleanError = error.toString()
				.replaceAll(this.client.token, '"<insert client token here>."')

			let errorMessage = 'An error occured';
			if (!isOwner)
				errorMessage += `, please contact ${owners.join(' or ')}.`;
			else
				errorMessage += '.';

			errorMessage += `\`\`\`js\n${cleanError}\`\`\``;

			message.util.send(errorMessage);
		}
	}
}