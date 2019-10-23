const { Listener } = require('discord-akairo');

module.exports = class CooldownListener extends Listener {
	constructor() {
		super('cooldown', {
			emitter: 'commandHandler',
			event: 'cooldown',
			category: 'commandHandler'
		});
	}

	exec(message, command, time) {
		let placeused = 'DM';
		if (message.guild)
			placeused = message.guild.name;

		console.log(`${message.author.username} (#${message.author.id}) was blocked from using ${command.id} in ${placeused} because of cooldown!`);

		if (!message.channel.sendable) return; 
		message.util.reply(global.translate(message.author.lang, "we're sorry, but you may not use the {0} command for another {1} seconds.", command.id, time / 1000));
	}
}