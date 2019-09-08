const { Command } = require('discord-akairo');

module.exports = class OwoCommand extends Command {
	constructor() {
		super('b', {
			category: 'Text Edits',
			aliases: ["b", '🅱'],
			description: {
				content: 'replace every b/B with a 🅱.',
				usage: '<text you\'d like to transform to a 🅱>'
			},
			args: [{
				id: 'toB',
				type: 'text-fun',
				match: 'content'
			}]
		});
	}

	exec(message, { toB }) {
		if (!toB)
			toB = global.getString(message.author.lang, "There were no text to Bify");

		if (!toB.includes('b') || !toB.includes('B'))
			return message.util.send(global.getString(message.author.lang, 'There was no Bs found in the text'));

		let text = toB.replace(/b/gi, "🅱").replace(/B/gi, "🅱")
		message.util.send(text);
	}
};