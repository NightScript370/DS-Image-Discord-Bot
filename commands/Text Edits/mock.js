const { Command } = require('discord-akairo');

module.exports = class MockCommand extends Command {
	constructor() {
		super('mock', {
			aliases: ['mock'],
			description: {
				content: "Mock someone's words with this"
			},
			category: 'Text Fun',
			args: [
				{
					id: "text",
					type: "text-fun",
					match: 'rest'
				},
				{
					id: "random",
					match: 'flag',
					flag: '--random'
				}
			]
		});
	}

	async exec(message, { text, random }) {
		if (!text)
			return message.util.send(global.lang.getString(message.author.lang, "I couldn't get text to mock."));

		let embed;
		if (message.guild)
			embed = this.client.util.embed().setFooter(global.lang.getString(message.author.lang, 'This command was ran by {0}', message.member.displayName));

		message.util.send(random ? this.randomMock(text) : this.perLetterMock(text), (embed && message.channel.embedable ? {embed} : {}));
	}

	perLetterMock (target) {
		let newContent = "";
		let chars = target.split("");
		for (let i = 0; i < chars.length; i++) {
			newContent += i % 2 == 0 ? chars[i].toUpperCase() : chars[i].toLowerCase();
		}

		return newContent;
	}

	randomMock (string) {
		return string.split("").map(char => Math.random() > 0.5 ? char.toUpperCase() : char.toLowerCase()).join("");
	}
}