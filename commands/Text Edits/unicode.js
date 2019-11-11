import Command from 'discord-akairo';

export default class UnicodeCommand extends Command {
	constructor() {
		super('unicode', {
			aliases: ['unicode'],
			description: {
				content: "Get information on each unicode character"
			},
			category: 'Useful',
			args: [
				{
					id: "text",
					type: "text-fun",
					match: 'rest'
				}
			]
		});
	}

	async exec(message, { text }) {
		if (!text)
			return message.util.send(global.translate(message.author.lang, "I couldn't get text to display unicode information on."));

		if (text.length > 50)
			return message.util.send(global.translate(message.author.lang, "Please limit your unicode view to 50 characters."))

		message.util.send(this.toUnicode(text));
	}

	toUnicode(string) {
		let strings = [];
		for (var char of string) {
			var hex = char.charCodeAt(0).toString(16);
			var uni = 'U+'+'0000'.substr(0, 4-hex.length)+hex;
			strings.push(`${char} => \`${uni.toUpperCase()}\``);
		};
		return strings.join(" **|** ");
	};
}