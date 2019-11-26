import { Command } from 'discord-akairo';
const write = require("util").promisify(require("fs").writeFile);

export default class RebootCommand extends Command {
	constructor() {
		super('reboot', {
			category: 'Bot Utilities',
			aliases: ['restart', 'respawn', 'reboot', '再起動'],
			description: {
				content: 'Reboots the bot.'
			},
			ownerOnly: true,
		});
	}

	async exec(message) {
		try {
			let rebootMessage = await message.util.send("I'm rebooting...");
			await write('./reboot.json', `{"id": "${rebootMessage.id}", "channel": "${message.channel.id}"}`)
		} catch {}

		process.exit()
	}
};