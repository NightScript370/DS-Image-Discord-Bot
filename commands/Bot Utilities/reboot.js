const { Command } = require('discord-akairo');
const { promisify } = require("util");
const write = promisify(require("fs").writeFile);

module.exports = class RebootCommand extends Command {
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
	  let m = await message.channel.send("I'm rebooting...");
	  await write('./reboot.json', `{"id": "${m.id}", "channel": "${m.channel.id}"}`).catch(console.error);
	  process.exit();
	}
};