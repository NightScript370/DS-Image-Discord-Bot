const { Command } = require('discord-akairo');
const questions = require('../../assets/JSON/wouldyourather');

module.exports = class WouldYouRatherCommand extends Command {
	constructor() {
		super('would-you-rather', {
			aliases: ['would-you-rather', 'wy-rather', 'wyr'],
			category: 'Fun',
			description: {
				content: 'Responds with a random "Would you rather ...?" question. Credits to dragonfire535 for making the json file'
			},
		});
	}

	exec(message) {
		if (message.channel.sendable)
			return message.util.reply(questions[Math.floor(Math.random() * questions.length)]);
	}
};