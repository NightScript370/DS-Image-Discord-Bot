const { Command } = require('discord-akairo');

module.exports = class toBCommand extends Command {
	constructor() {
		super('b', {
			category: 'Text Fun',
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
			toB = global.lang.getString(message.author.lang, "There were no text to Bify");

		if (!toB.includes('b') && !toB.includes('B'))
			return message.util.send(global.lang.getString(message.author.lang, 'There was no Bs found in the text'));

		let text = toB.replace(/b/gi, "🅱").replace(/B/gi, "🅱")
		let embed;

		if (message.guild)
			embed = this.client.util.embed().setFooter(global.lang.getString(message.author.lang, 'This command was ran by {0}', message.member.displayName));
		message.util.send(text, (embed && message.channel.embedable ? {embed} : {}));
	}
};