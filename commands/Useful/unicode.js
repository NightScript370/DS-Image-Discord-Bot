const { Command } = require('discord-akairo');

module.exports = class UnicodeCommand extends Command {
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
			return message.util.send(global.getString(message.author.lang, "I couldn't get text to display unicode information on."));

		message.util.send(this.toUnicode(text));
	}

	toUnicode(string) {
		let str = '';
		for (var char of string) {
			var hex = char.charCodeAt(0).toString(16);
			var uni = 'U+'+'0000'.substr(0, 4-hex.length)+hex;
			str += `\n${char} => \`${uni.toUpperCase()}\``;
		};
		return str.trim();
	};
}