const { Command } = require('discord-akairo');

module.exports = class BinaryCommand extends Command {
	constructor() {
		super('binary', {
			category: 'Text Edits',
			aliases: ["binary", 'binary-code'],
			description: {
				content: 'Translates your text into Binary',
				usage: '<text you\'d like to translate to binary>'
			},
			args: [{
				id: 'toBinary',
				type: 'text-fun',
				match: 'content'
			}]
		});
	}

	exec(message, { toBinary }) {
		message.util.send(this.binary(toBinary));
	}

	binary(text) {
		return text.split('').map(str => {
			const converted = str.charCodeAt(0).toString(2);
			return `${'00000000'.slice(converted.length)}${converted}`;
		}).join('');
	}
};