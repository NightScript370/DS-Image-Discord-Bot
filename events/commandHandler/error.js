import Listener from 'discord-akairo';
import { error as _error, stacktrace } from '../../utils/Logger';

export default class errorListener extends Listener {
	constructor() {
		super('error', {
			emitter: 'commandHandler',
			event: 'error',
			category: 'commandHandler'
		});
	}

	exec(error, message, command=null) {
		const __ = (k, ...v) => global.translate(message.author.lang, k, ...v);
		_error('An error occured in a command.');

		const tag = message.guild ? message.guild.name : `${message.author.tag}/PM`;
		_error(message.content, { tag });
		stacktrace(error);

		if (command) {
			const current = this.client.commandHandler.games.get(message.author.id);
			if (current && current.name == command.id)
				this.client.commandHandler.games.delete(message.author.id);
		}

		if (message.channel.sendable) {
			if (error.toString().includes('UDP Watchdog Timeout'))
				return message.util.reply(__("The game server is offline. Please try connecting at a later date"));

			if (error.stack.includes('ENOTFOUND'))
				return message.util.reply(__("The game server was not found. Please try again."));

			if (error.stack.includes('TCP Connection Refused'))
				return message.util.reply(__("The game server refused the connection. Please try again."));

			const owners = this.client.ownerID.map(id => this.client.users.get(id).tag);
			const isOwner = owners.filter(owner => message.author.tag == owner).length;

			let cleanError = error.toString()
				.replaceAll(this.client.token, '"<insert client token here>."')
			
			if (this.client.dbl && this.client.dbl.token)
				cleanError.replaceAll(this.client.dbl.token, '"<insert DiscordBots.org token here>"');

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