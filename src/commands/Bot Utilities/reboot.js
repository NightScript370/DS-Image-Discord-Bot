import discordAkairo from 'discord-akairo';
const write = import("util").promisify(import("fs").writeFile);

export default class RebootCommand extends discordAkairo.Command {
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
		if (message.channel.sendable)
			try {
				let rebootMessage = await message.util.send("I'm rebooting...");
				await write('./reboot.json', JSON.stringify({ id: rebootMessage.id, channel: message.channel.id }));
			} catch {}

		process.exit()
	}
};