const { Command } = require('discord-akairo');

module.exports = class OwoCommand extends Command {
	constructor() {
		super('owoify', {
			category: 'Text Edits',
			aliases: ["owoifi", 'owoify', 'owo-ify'],
			description: {
				content: 'Owoify what you say.',
				usage: '<text you\'d like to Owoify>'
			},
			args: [{
				id: 'toOwo',
				type: 'text-fun',
				match: 'content'
			}]
		});
	}

	exec(message, { toOwo }) {
		message.channel.send(this.OwOify(toOwo));
	}

	OwOify(text) {
		return text
			.replaceAll('speak', 'spweak')
			.replaceAll('need', 'nweed')
			.replaceAll('stand', 'stwand')
			.replaceAll(/[rl]/gm, "w")
			.replaceAll(/[RL]/gm, "W")
			.replaceAll(/ove/g, 'uv')
			.trim();
	}
};