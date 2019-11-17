import Command from 'discord-akairo';
import questions from '../../assets/JSON/wouldyourather';

export default class WouldYouRatherCommand extends Command {
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
			return message.util.reply(questions.random());
	}
};